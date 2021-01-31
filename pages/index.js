import React from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

import db from '../db.json';
import Widget from '../src/components/Widget';
import QuizLogo from '../src/components/QuizLogo';
import QuizContainer from '../src/components/QuizContainer';
import QuizBackground from '../src/components/QuizBackground';
import Footer from '../src/components/Footer';
import GitHubCorner from '../src/components/GitHubCorner';
import Input from '../src/components/Input';
import Button from '../src/components/Button';
import Link from '../src/components/Link';

export default function Home() {

  const router = useRouter();
  const [name, setName] = React.useState(''); //estado inicial
  const [exitTime, setExitTime] = React.useState(false);

  return (
    <QuizBackground backgroundImage={db.bg}>
      <QuizContainer>
        <QuizLogo />

        <AnimatePresence>
          <Widget
            as={motion.section}
            transition={{ delay: 0.1, duration: 0.5 }}
            variants={{
              show: {opacity: 1, x: '0'},
              hidden: {opacity: 0, x: '100%'},
              exit: {opacity: 0, x: '-100%'}
            }}
            initial="hidden"
            animate={exitTime ? 'exit' : 'show'}
          >
            <Widget.Header>
              <h1>Patrulha da Noite - O Quiz</h1>
            </Widget.Header>
            <Widget.Content>
              <form onSubmit={ (e) => {
                e.preventDefault();
                setExitTime(true);
                setTimeout( ()=>{
                  router.push(`/quiz?name=${name}`);
                }, 1 * 1000)
              }}
              >
                <Input
                  name="nomeDoUsuario"
                  onChange={ (e) => {setName(e.target.value)} }
                  placeholder="Digite seu nome para jogar" 
                  value={name}
                />
                <Button type="submit" disabled={name.length === 0}>
                  Jogar
                </Button>
              </form>
            </Widget.Content>
          </Widget>
        </AnimatePresence>

        <Widget
          as={motion.section}
          transition={{ delay: 0.3, duration: 0.5 }}
          variants={{
            show: {opacity: 1, x: '0'},
            hidden: {opacity: 0, x: '100%'},
            exit: {opacity: 0, x: '-100%'}
          }}
          initial="hidden"
          animate={exitTime ? 'exit' : 'show'}
        >
          <Widget.Content>
            <h1>Outros Quizes</h1>

            <ul>
              {db.external.map((linkExterno) => {
                const [projectName, githubUser] = linkExterno
                  .replace(/\//g, '')
                  .replace('https:', '')
                  .replace('.vercel.app', '')
                  .split('.');

                return (
                  <li key={`${githubUser}_${projectName}`}>
                    <Widget.Topic 
                      as={Link}
                      href={ name.length === 0 ? '' : `/quiz/${projectName}___${githubUser}?name=${name}`}
                      
                    >
                      {`${githubUser}/${projectName}`}
                    </Widget.Topic>
                  </li>
                );

              })}

            </ul>
            
          </Widget.Content>
        </Widget>
        <Footer 
          as={motion.section}
          transition={{ duration: .6 }}
          variants={{
            hidden: {opacity: 0, scale: 0}
          }}
          animate={exitTime ? 'hidden' : ''}
        />
      </QuizContainer>
      <GitHubCorner projectUrl="https://github.com/heyralfs/patrulhadanoite-quiz" />
    </QuizBackground>
  );
}
