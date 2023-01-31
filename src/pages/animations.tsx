import { motion, useAnimation } from "framer-motion";
import _ from "lodash";
import { useCallback, useEffect, useState } from "react";

const TEXTS = [
  "/authentication",
  "/org-management",
  "/billing",
  "/emails",
  "/onboarding",
];

// * const container = {
// *   hidden: { opacity: 0 },
// *   show: {
// *     opacity: 1,
// *     transition: {
// *       staggerChildren: 0.5
// *     }
// *   }
// * }
// *
// * const item = {
// *   hidden: { opacity: 0 },
// *   show: { opacity: 1 }
// * }
// *
// * return (
// *   <motion.ol
// *     variants={container}
// *     initial="hidden"
// *     animate="show"
// *   >
// *     <motion.li variants={item} />
// *     <motion.li variants={item} />
// *   </motion.ol>
// * )
// *

export default function Animations() {
  return (
    <div className="h-full w-full bg-slate-900 p-16 text-white">
      <div className="flex flex-col gap-y-16">
        {TEXTS.map((text, i) => (
          <div key={i}>
            <Title word={text} />
            {/* <div className="h-[500px] w-[500px] bg-slate-800">some content</div> */}
          </div>
        ))}
      </div>
    </div>
  );
}

function Title({ word }: { word: string }) {
  const allLetters = word.split("");
  const [currentLetters, setCurrentLetters] = useState<string[]>([]);
  const staggerChildren = 0.08;
  const totalStagger = allLetters.length * staggerChildren;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren,
        delayChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: 0,
      },
    },
  };

  const handleNextLetter = useCallback(() => {
    const nextLetter = allLetters[currentLetters.length];
    if (nextLetter) {
      setCurrentLetters([...currentLetters, nextLetter]);
    }
  }, [allLetters, currentLetters]);

  useEffect(() => {
    const nextTimeout = _.random(60, 200);
    const timeout = setTimeout(() => {
      handleNextLetter();
    }, nextTimeout);

    return () => clearTimeout(timeout);
  }, [handleNextLetter]);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex font-mono text-4xl"
    >
      {currentLetters.map((letter, i) => (
        <motion.div key={i} variants={item}>
          {letter}
        </motion.div>
      ))}
      <motion.div
        className="h-[42px] w-[24px] bg-slate-300"
        animate={{ opacity: [null, 1, 0] }}
        transition={{
          duration: 1,
          repeat: Infinity,
          times: [0, 0.5, 0.5],
          ease: () => 1,
        }}
      />
    </motion.div>
  );
}
