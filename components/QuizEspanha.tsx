"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { motion, AnimatePresence } from "framer-motion"
import confetti from 'canvas-confetti'

type Pergunta = {
  pergunta: string
  opcoes: string[]
  respostaCorreta: number
}

const perguntas: Pergunta[] = [
  {
    pergunta: "Qual é a capital da Espanha?",
    opcoes: ["Barcelona", "Madrid", "Sevilha", "Valência"],
    respostaCorreta: 1
  },
  {
    pergunta: "Qual é o prato típico espanhol feito com arroz?",
    opcoes: ["Paella", "Gazpacho", "Tortilla", "Churros"],
    respostaCorreta: 0
  },
  {
    pergunta: "Qual famoso arquiteto espanhol projetou a Sagrada Família em Barcelona?",
    opcoes: ["Pablo Picasso", "Salvador Dalí", "Antoni Gaudí", "Diego Velázquez"],
    respostaCorreta: 2
  },
  {
    pergunta: "Qual é o nome da moeda utilizada na Espanha?",
    opcoes: ["Peseta", "Libra", "Franco", "Euro"],
    respostaCorreta: 3
  },
  {
    pergunta: "Qual esporte é tradicionalmente associado à Espanha?",
    opcoes: ["Críquete", "Rugby", "Tourada", "Hóquei no gelo"],
    respostaCorreta: 2
  }
]

const MINIMO_RESPOSTAS_CORRETAS = 3
const TEMPO_POR_PERGUNTA = 20 //

const TituloQuiz = () => (
  <motion.div
    initial={{ opacity: 0, y: -50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="text-center mb-6 text-white"
  >
    <div className="mb-4">
      <Image
        src="/Neuron.png"
        alt="Logo da Neuron"
        width={150}
        height={150}
        className="mx-auto"
      />
    </div>
    <h1 className="text-4xl font-bold mb-2">Quizzes da Neuron</h1>
    <p className="text-xl">Acerte as perguntas e ganhe um brinde da Neuron!</p>
  </motion.div>
)

const AnimatedBackground = () => (
  <div className="fixed inset-0 -z-10">
    <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-purple-700 to-black"></div>
    <div className="absolute inset-0 opacity-30">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 4 + 1}px`,
            height: `${Math.random() * 4 + 1}px`,
            animation: `twinkle ${Math.random() * 5 + 5}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`
          }}
        ></div>
      ))}
    </div>
  </div>
)

export default function QuizEspanha() {
  const [perguntaAtual, setPerguntaAtual] = useState(0)
  const [respostas, setRespostas] = useState<number[]>([])
  const [mostrarResultado, setMostrarResultado] = useState(false)
  const [selecaoAtual, setSelecaoAtual] = useState<string | null>(null)
  const [tempo, setTempo] = useState(TEMPO_POR_PERGUNTA)

  useEffect(() => {
    if (tempo > 0 && !mostrarResultado) {
      const timer = setTimeout(() => setTempo(tempo - 1), 1000)
      return () => clearTimeout(timer)
    } else if (tempo === 0 && !mostrarResultado) {
      handleResposta(selecaoAtual || '')
    }
  }, [tempo, mostrarResultado])

  useEffect(() => {
    setTempo(TEMPO_POR_PERGUNTA)
  }, [perguntaAtual])

  const handleResposta = (resposta: string) => {
    if (resposta === null) return

    const respostaNum = parseInt(resposta)
    const novasRespostas = [...respostas, respostaNum]
    setRespostas(novasRespostas)

    if (perguntaAtual < perguntas.length - 1) {
      setPerguntaAtual(perguntaAtual + 1)
      setSelecaoAtual(null)
    } else {
      setMostrarResultado(true)
    }
  }

  const calcularPontuacao = () => {
    return respostas.filter((resposta, index) => resposta === perguntas[index].respostaCorreta).length
  }

  const reiniciarQuiz = () => {
    setPerguntaAtual(0)
    setRespostas([])
    setMostrarResultado(false)
    setSelecaoAtual(null)
    setTempo(TEMPO_POR_PERGUNTA)
  }

  if (mostrarResultado) {
    const pontuacao = calcularPontuacao()
    const ganhouBrinde = pontuacao >= MINIMO_RESPOSTAS_CORRETAS

    if (ganhouBrinde) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    }

    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-4 relative overflow-hidden">
        <AnimatedBackground />
        <TituloQuiz />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="bg-white/10 backdrop-blur-md text-white h-[420px] flex flex-col">
            <CardHeader>
              <CardTitle>Resultado do Quiz</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-center">
              <p className="text-lg mb-4">
                Você acertou {pontuacao} de {perguntas.length} perguntas.
              </p>
              <p className="text-xl font-bold">
                {ganhouBrinde
                  ? "Parabéns! Você ganhou o brinde!"
                  : "Infelizmente, você não ganhou o brinde desta vez."}
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={reiniciarQuiz} className="w-full bg-purple-500 hover:bg-purple-600 text-white h-14">
                Jogar Novamente
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    )
  }

  const perguntaAtualObj = perguntas[perguntaAtual]

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <AnimatedBackground />
      <TituloQuiz />
      <motion.div
        key={perguntaAtual}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white/10 backdrop-blur-md text-white h-[420px] flex flex-col">
          <CardHeader className="space-y-4">
            <CardTitle>Pergunta {perguntaAtual + 1} de {perguntas.length}</CardTitle>
            <Progress 
              value={(tempo / TEMPO_POR_PERGUNTA) * 100} 
              className="w-full bg-white/20" 
            />
          </CardHeader>
          <CardContent className="flex-grow grid grid-rows-[auto,1fr] gap-4">
            <p className="text-lg">{perguntaAtualObj.pergunta}</p>
            <RadioGroup 
              onValueChange={(value) => setSelecaoAtual(value)} 
              value={selecaoAtual || undefined} 
              className="grid grid-rows-4 gap-3"
            >
              {perguntaAtualObj.opcoes.map((opcao, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center space-x-2 bg-white/5 p-3 rounded-md hover:bg-white/10 transition-colors"
                >
                  <RadioGroupItem
                    value={index.toString()}
                    id={`opcao-${index}`}
                    checked={selecaoAtual === index.toString()}
                    className="border-white text-white"
                  />
                  <Label htmlFor={`opcao-${index}`} className="text-white cursor-pointer flex-grow">
                    {opcao}
                  </Label>
                </motion.div>
              ))}
            </RadioGroup>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => handleResposta(selecaoAtual || '')}
              disabled={selecaoAtual === null}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white h-14"
            >
              {perguntaAtual === perguntas.length - 1 ? 'Finalizar' : 'Próxima'}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

