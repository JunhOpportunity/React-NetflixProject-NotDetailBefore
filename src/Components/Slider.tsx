import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { getMovies, IGetMoviesResult } from "../api";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useState } from "react";
import { useMatch, useNavigate, PathMatch } from "react-router-dom";

const Row = styled(motion.div)`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const rowVariants = {
  hidden: { x: window.outerWidth },
  visible: { x: 0 },
  exit: { x: -window.outerWidth }
};

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  height: 200px;
  font-size: 20px;
  background-size: cover;
  background-position: center center;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const boxVariants = {
  normal: {
    scale: 1
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.5,
      duration: 0.5,
      type: "tween"
    }
  }
};

const Info = styled(motion.div)`
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 14px;
  }
`;

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween"
    }
  }
};

const SliderProps = {
  fetchPageNumber: Number
};

export default function Slider(page: Number) {
  const { scrollY } = useScroll();
  const history = useNavigate();
  const onOverlayClick = () => {
    history("/");
  };
  const bigMovieMatch = useMatch("/movies/:movieId");
  console.log(bigMovieMatch);
  const offset = 6;
  const { data, isLoading } = useQuery<IGetMoviesResult>([
    "movies",
    "nowPlaying"
  ]);

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
    }
    toggleLeaving();
    const totalMovies = data.results.length - 1;
    const maxIndex = Math.floor(totalMovies / offset) - 1;
    setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
  };
  const onBoxClicked = (movieId: number) => {
    history(`/movies/${movieId}`);
  };
  const boxVariants = {
    normal: {
      scale: 1
    },
    hover: {
      scale: 1.3,
      y: -50,
      transition: {
        delay: 0.5,
        duration: 0.5,
        type: "tween"
      }
    }
  };

  return (
    <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
      {/* onExitCOmplete: exit이 끝났을 때 실행 */}
      <Row
        variants={rowVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ type: "tween", duration: 1 }}
        key={index}
      >
        {data?.results
          .slice(1)
          .slice(offset * index, offset * index + offset)
          .map((movie) => (
            <Box
              layoutId={movie.id + ""}
              key={movie.id}
              bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
              whileHover="hover"
              initial="normal"
              onClick={() => onBoxClicked(movie.id)}
              transition={{ type: "tween" }}
              variants={boxVariants}
            >
              <Info variants={infoVariants}>
                <h4>{movie.title}</h4>
              </Info>
            </Box>
          ))}
      </Row>
    </AnimatePresence>
  );
}
