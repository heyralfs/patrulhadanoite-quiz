import React from 'react';
import Lottie from 'react-lottie';
import Widget from '../../components/Widget';
import QuizLogo from '../../components/QuizLogo';
import QuizBackground from '../../components/QuizBackground';
import QuizContainer from '../../components/QuizContainer';
import Button from '../../components/Button';
import AlternativesForm from '../../components/AlternativesForm';
import BackLinkArrow from '../../components/BackLinkArrow';
import { motion } from 'framer-motion';
import GitHubCorner from '../../components/GitHubCorner';
import { useRouter } from 'next/router';
import Confetti from 'react-confetti';

import loadingAnimation from './animation/loading.json';
import correctAnimation from './animation/correct.json';
import incorrectAnimation from './animation/incorrect.json';

function ResultWidget({ results, db }) {

  const router = useRouter();
  const name = router.query.name;

  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  return (
    <>
      { results.filter((x) => x).length > 2 &&
        <Confetti width={windowWidth} height={windowHeight} recycle={false} />
      }
      <Widget
       as={motion.section}
       transition={{ delay: 0.1, duration: 0.5 }}
       variants={{
         hidden: { opacity: 0, scale: 0 },
         show: { opacity: 1, scale: 1 }
       }}
       initial='hidden'
       animate='show' 
      >
        <Widget.Header>
          <h1>
            <span style={{ textTransform: 'capitalize' }}>{name}</span>, aqui está seu resultado:
          </h1>
        </Widget.Header>

        <Widget.Content>
          <h1> 
            Você acertou
            {' '}
            {/*
            {results.reduce( (somaAtual, resultadoAtual) =>  {
              const isAcerto = resultadoAtual === true;
              if ( isAcerto ) {
                return somaAtual + 1;
              }
              return somaAtual;
            }, 0)} 
            */}
            { results.filter((x) => x).length }
            {' '}
            perguntas! 
          </h1>
          <ul>
            { results.map( (result, index) => (
              <li key={`result__${index}`}>
                { result === true && 
                  <p style={{ color: `${db.theme.colors.success}` }}> 
                  #{index + 1} Resultado: Acertou
                  </p>
                }

                { result !== true && 
                  <p style={{ color: `${db.theme.colors.wrong}` }}>
                    #{index + 1} Resultado: Errou
                  </p>
                }

              </li>
            ))}
          </ul>

          <Button
            type='button'
            onClick={ () => router.push('/') }
          >
            Tentar novamente
          </Button>
        </Widget.Content>
      </Widget>
    </>
  );
}

function LoadingWidget() {
  
  const [exitTime, setExitTime] = React.useState(false);

  setTimeout( ()=>{
    setExitTime(true)
  }, 2.2 * 1000)

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };
  return (
    <>
      <Widget
        as={motion.section}
        transition={{ delay: 0.2, duration: 0.3 }}
        variants={{
          show: {opacity: 1, scale: 1},
          hidden: {opacity: 0, scale: 0},
        }}
        initial="hidden"
        animate={exitTime ? 'hidden' : 'show'}
      >
        <Widget.Header>
          Carregando...
        </Widget.Header>
            
        <Widget.Content style={ {minHeight: '50vh'} }>
          <Lottie 
            options={defaultOptions}
            height={200}
            width={200}
          />
        </Widget.Content>
      </Widget>
    </>
  );
}

function QuestionWidget({
  question,
  questionIndex,
  totalQuestions,
  onSubmit,
  addResult,
}) {

  const defaultOptionsCorrect = {
    loop: false,
    autoplay: true,
    animationData: correctAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  const defaultOptionsIncorrect = {
    loop: false,
    autoplay: true,
    animationData: incorrectAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  const [selectedAlternative, setSelectAlternative] = React.useState(undefined);
  const [isQuestionSubmited, setIsQuestionSubmited] = React.useState(false);
  const questionId = `question__${questionIndex}`;
  const isCorrect = selectedAlternative === question.answer;
  const hasAlternativeSelected = selectedAlternative !== undefined;

  const [exitTime, setExitTime] = React.useState(false);
  const [showAnimated, setShowAnimated] = React.useState(true);

  return (
    <Widget
      as={motion.section}
      transition={ showAnimated ? { delay: 0.2, duration: 0.5 } : { delay: 0, duration: 0 } }
      variants={{
        show: {opacity: 1, x: '0'},
        hidden: {opacity: 0, x: '100%'},
        exit: {opacity: 0, x: '-100%'}
      }}
      initial="hidden"
      animate={
        exitTime ? ( showAnimated ? 'exit' : 'hidden' ) : ( showAnimated ? 'show' : '')
      }
    >
      <Widget.Header>
        <BackLinkArrow href="/" />
        <h3>
          {`Pergunta ${questionIndex + 1} de ${totalQuestions}`}
        </h3>
      </Widget.Header>

      <img
        alt="Descrição"
        style={{
          width: '100%',
          height: '150px',
          objectFit: 'cover',
        }}
        src={question.image}
      />
      <Widget.Content>
        <h2>
          {question.title}
        </h2>
        <p>
          {question.description}
        </p>

        <AlternativesForm
          onSubmit={(e) => {
            e.preventDefault();
            setIsQuestionSubmited(true);
            setTimeout( () => {
              setExitTime(true);
            }, 2 * 1000);
            setTimeout( () => {
              addResult(isCorrect);
              onSubmit();
              setIsQuestionSubmited(false);
              setSelectAlternative(undefined);
              setShowAnimated(false);
              setExitTime(false);
              setShowAnimated(true);
            }, 2.8 * 1000);
          }}
        >
          {question.alternatives.map((alternative, alternativeIndex) => {
            const alternativeId = `alternative__${alternativeIndex}-${questionIndex}`;
            const alternativeStatus = isCorrect ? 'SUCCESS' : 'ERROR';
            const isSelected = selectedAlternative === alternativeIndex;
            return (
              <Widget.Topic
                as={motion.label}
                transition={{ duration: 0.1 }}
                whileTap={{ scale: 0.9 }}
                key={alternativeId}
                htmlFor={alternativeId}
                data-selected={isSelected}
                data-status={isQuestionSubmited && alternativeStatus}
              >
                <input
                  style={{ display: 'none' }}
                  id={alternativeId}
                  name={questionId}
                  onChange={ () => setSelectAlternative(alternativeIndex) }
                  type="radio"
                />
                {alternative}
              </Widget.Topic>
            );
          })}

          { !isQuestionSubmited &&
            <Button type="submit" disabled={!hasAlternativeSelected}>
              Confirmar
            </Button>
          }

          { isQuestionSubmited && isCorrect && <Lottie options={defaultOptionsCorrect} height={50} width={50} margin-top='20px' /> }
          { isQuestionSubmited && !isCorrect && <Lottie options={defaultOptionsIncorrect} height={50} width={50} margin-top='20px' /> }

        </AlternativesForm>
      </Widget.Content>
    </Widget>
  );
}

const screenStates = {
  QUIZ: 'QUIZ',
  LOADING: 'LOADING',
  RESULT: 'RESULT',
};


export default function QuizPage({ db }) {
  const [screenState, setScreenState] = React.useState(screenStates.LOADING);
  const [results, setResults] = React.useState([]);
  const totalQuestions = db.questions.length;
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const questionIndex = currentQuestion;
  const question = db.questions[questionIndex];
  const bg = db.bg;

  function addResult(result) {
    setResults([
      ...results,
      result,
    ]);
  }

  // [React chama de: Efeitos || Effects]
  // React.useEffect
  // atualizado === willUpdate
  // morre === willUnmount

  React.useEffect(() => {
    // fetch() ...
    setTimeout(() => {
      setScreenState(screenStates.QUIZ);
    }, 3 * 900);
  // nasce === didMount
  }, []);

  function handleSubmitQuiz() {
    const nextQuestion = questionIndex + 1;
    if (nextQuestion < totalQuestions) {
      setCurrentQuestion(nextQuestion);
    } else {
      setScreenState(screenStates.RESULT);
    }
  }

  return (
    <QuizBackground backgroundImage={bg}>
      <QuizContainer>
        <QuizLogo />
        {screenState === screenStates.QUIZ && (
          <QuestionWidget
            question={question}
            questionIndex={questionIndex}
            totalQuestions={totalQuestions}
            onSubmit={handleSubmitQuiz}
            addResult={addResult}
          />
        )}

        { screenState === screenStates.LOADING && <LoadingWidget /> }

        { screenState === screenStates.RESULT && <ResultWidget results={results} db={db} /> }
      </QuizContainer>
      <GitHubCorner projectUrl="https://github.com/heyralfs/patrulhadanoite-quiz" />
    </QuizBackground>
  );
}