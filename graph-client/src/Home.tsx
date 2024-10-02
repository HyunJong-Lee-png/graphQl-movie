import { gql, useQuery } from "@apollo/client";
import { Link } from "react-router-dom";

interface Movie {
  title: string;
  id: number;
}

interface AllMovies {
  allMovies: Movie[]
}

const getAllMovies = gql`
  query{
    allMovies{
      title,
      id
    }
  }
`;

export default function Home() {
  const { data, loading, error } = useQuery<AllMovies>(getAllMovies);
  const movies = data?.allMovies ?? [];
  return (
    <>
      <div>
        {loading ?
          <h1>is Loading...</h1>
          : error ?
            <h1>error occured!</h1>
            :
            <ul>
              <h1>Movies</h1>
              {movies.map(movie =>
                <li key={movie.id}>
                  <Link to={`/movie/${movie.id}`}>{movie.title}</Link>
                </li>)}
            </ul>
        }
      </div>
    </>
  );
}