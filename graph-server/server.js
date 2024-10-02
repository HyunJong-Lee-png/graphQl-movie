const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");

const tweets = [
  {
    id: "1",
    text: 'first one',
    userId: "2",
  },
  {
    id: "2",
    text: 'second one',
    userId: "3",
  },
  {
    id: "3",
    text: 'third one',
    userId: "1",
  },
];

const users = [
  {
    id: "1",
    firstName: 'Lee',
    lastName: 'hyunjong',
  },
  {
    id: "2",
    firstName: 'Nico',
    lastName: 'legolas'
  },
  {
    id: "3",
    firstName: 'Kim',
    lastName: 'sezu'
  }
]

const typeDefs = `#graphql
  # !는 required, 없으면 해당Type | null을 반환
  type Movie {
    id: Int!
    url: String!
    imdb_code: String!
    title: String!
    title_english: String!
    title_long: String!
    slug: String!
    year: Int!
    rating: Float!
    runtime: Int!
    genres: [String!]
    summary: String
    description_full: String!
    synopsis: String!
    yt_trailer_code: String!
    language: String!
    mpa_rating: String!
    background_image: String!
    background_image_original: String!
    small_cover_image: String!
    medium_cover_image: String!
    large_cover_image: String!
    state: String!
  }
  # 왜 안되냐고?
  type User {
    id:ID!
    firstName:String!
    lastName:String!
    """
    Is the sum of firstName and lastName
    """
    fullName:String!
  }
  """
  Tweet object represents a resource for a tweet
  """
  type Tweet {
    id:ID!
    text:String!
    """
    Person who write this tweet
    """
    author:User
  }
   # Query type은 필수로 작성해야 됨(= rest API의 GET요청 Query = /)
  type Query {
    allTweets:[Tweet!]!
    tweet(id:ID!):Tweet
    allUsers:[User!]!
    allMovies:[Movie!]!
    movie(id:ID!):Movie
  }
  # GET요청을 제외한 모든 요청들은 Mutation type에 넣어줌
  type Mutation {
    postTweet(text:String!,userId:ID!):Tweet!
    """
    Delete a Tweet if it is, or return false
    """
    deleteTweet(id:ID!):Boolean!
  }
`;

const resolvers = {
  Query: {
    allTweets() {
      return tweets;
    },
    tweet(_, { id }) {
      const tweet = tweets.find(tweet => tweet.id === id);
      return tweet;
    },
    allUsers() {
      return users;
    },
    allMovies: async function () {
      const res = await fetch("https://yts.mx/api/v2/list_movies.json");
      const data = await res.json();
      return data.data.movies;
    },
    movie(_, { id }) {
      return fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`)
        .then(res => res.json())
        .then(data => data.data.movie.id !== 0 ? data.data.movie : null);
    },
  },
  Mutation: {
    postTweet(_, { text, userId }) {
      const user = users.find(user => user.id === userId);
      if (user) {
        const newTweet = {
          id: tweets.length + 1, //실제에선 delete땜에 이런식으로 하면x
          text,
          userId,
        };
        tweets.push(newTweet);
        return newTweet;
      } else {
        throw new Error(`Cannot find userId ${userId}`)
      }
    },
    deleteTweet(_, { id }) {
      const idx = tweets.findIndex(tweet => tweet.id === id);
      if (idx > -1) {
        tweets.splice(idx, 1);
        return true;
      } else {
        return false;
      }
    }
  },
  User: {
    fullName({ firstName, lastName }) {
      return firstName + lastName;
    }
  },
  Tweet: {
    author({ userId }, _) {
      const user = users.find(user => user.id === userId);
      return user;
    },
  },

}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (err) => {
    console.error('GraphQl Error:', err); //배포환경에서는 err.extensions.stackTrace는 보안위협이 있으므로 제외해서 클라이언트에 보낸다.
    return {
      message: err.message,
      code: err.extensions.code,
      locations: err.locations,
      path: err.path,
    }
  }
});

async function serverOn() {
  const { url } = await startStandaloneServer(server);
  console.log(`Server is running on ${url}`);
};

serverOn();

