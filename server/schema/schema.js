const graphql = require("graphql");
const _ = require("lodash");
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLInt, GraphQLSchema, GraphQLList, GraphQLNonNull } = graphql;
const Book = require("../models/books");
const Author = require("../models/authors");


// Book Schema Model - type of GraphQLObjectType
const BookType = new GraphQLObjectType({
  name:"Book",
  fields:() =>({

    id:{type: GraphQLID},
    name:{type: GraphQLString},
    genre:{type:GraphQLString},
    author: {
      type: AuthorType,
      resolve(parent,args){
        return Author.findById(parent.authorId);
      }
    }

  })
});

// Author Schema Model - type of GraphQLObjectType
const AuthorType = new GraphQLObjectType({
  name:"Author",
  fields:() =>({

    id:{type: GraphQLID},
    name:{type: GraphQLString},
    age:{type:GraphQLInt},
    books:{
      type: new GraphQLList(BookType),
      resolve(parent,args){
        return Book.find({authorId: parent.id});
      }
    }

  })
});


const RootQuery = new GraphQLObjectType({

  name:"RootQueryType",
  fields:{
    book:{
      type: BookType,
      args: {id: {type: GraphQLID}},
      resolve(parent,args){
        // code to get data from the db or other source
        return Book.findById(args.id);
      }
    },
    author:{

      type: AuthorType,
      args: {id: {type: GraphQLID}},
      resolve(parent,args){
        return Author.findById(args.id);
      }
    },
    books:{
      type: new GraphQLList(BookType),
      resolve(parent,args){
        return Book.find({});
      }

    },
    authors:{
      type: new GraphQLList(AuthorType),
      resolve(parent,args){
        return Author.find({});
      }
    }
  }
});

const Mutation = new GraphQLObjectType({

  name: "Mutation",
  fields: {
    addAuthor:{
      type: AuthorType,
      args:{
        name: { type: new GraphQLNonNull(GraphQLString)},
        age: { type: new GraphQLNonNull(GraphQLInt)}
      },
      resolve(parent,{name,age}){
        let author = new Author({
          name,
          age
        });
        return author.save();
      }
    },
    addBook:{
      type: BookType,
      args:{
        name:{type: new GraphQLNonNull(GraphQLString)},
        genre:{type: new GraphQLNonNull(GraphQLString)},
        authorId:{type: new GraphQLNonNull(GraphQLID)}
      },
      resolve(parent,{name,genre,authorId}){
        let book = new Book({
          name,
          genre,
          authorId
        });
        return book.save();
      }
    }
  }
});


module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
