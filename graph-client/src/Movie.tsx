import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import styles from './Movie.module.css';

interface MovieInfo {
  id: number;
  title: string;
  rating: number;
  medium_cover_image: string;
  like: boolean;
}

interface Movie {
  movie: MovieInfo
}

const getMovie = gql`
  query($id:ID!){
    movie(id:$id){
      id
      title
      rating
      medium_cover_image
      like @client
    }
  }
`;

export default function Movie() {
  const { id } = useParams();
  const { data, loading, client: { cache } } = useQuery<Movie>(getMovie, {
    variables: {
      id,
    },
  });

  const handleClick = () => {
    if (!data) return;

    cache.writeFragment({
      id: `Movie:${id}`,
      fragment: gql`
        fragment toggleLike on Movie{
          like
        }
      `,
      data: {
        like: !data.movie.like
      }
    })
  };

  return (
    <div className={styles.container}>
      <div className={styles.movieInfo}>
        <div className={styles.movieTitle}>{loading ? "Loading..." : data?.movie.title}</div>
        <div className={styles.movieRating}>⭐{data?.movie.rating}</div>
        <button onClick={handleClick}>{data?.movie.like ? 'Unlike' : 'Like'}</button>
      </div>
      <div>
        <img
          className={styles.movieImg}
          src={data?.movie.medium_cover_image} />
      </div>
    </div>
  );
}