"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Loader2, Code, ImageIcon, FileText } from "lucide-react"

type Message = {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  hasArtifact?: boolean
}

type SlashCommand = {
  id: string
  name: string
  description: string
  action: () => void
}

type Artifact = {
  id: string
  type: "code" | "image" | "text"
  content: string | React.ReactNode
  title: string
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! Type / to see available commands.",
      sender: "ai",
      timestamp: new Date(),
    },
  ])

  const [inputValue, setInputValue] = useState("")
  const [showCommands, setShowCommands] = useState(false)
  const [showRightPanel, setShowRightPanel] = useState(false)
  const [currentArtifact, setCurrentArtifact] = useState<Artifact | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const commandsRef = useRef<HTMLDivElement>(null)

  // Placeholder slash commands - easily replaceable
  const slashCommands: SlashCommand[] = [
    {
      id: "help",
      name: "/help",
      description: "Show available commands",
      action: () => handleSendMessage("Show me all available commands"),
    },
    {
      id: "clear",
      name: "/clear",
      description: "Clear chat history",
      action: () => {
        setMessages([])
        setShowRightPanel(false)
      },
    },
    {
      id: "code",
      name: "/code",
      description: "Generate sample code",
      action: () => handleSendMessage("Generate a React component"),
    },
    {
      id: "image",
      name: "/image",
      description: "Generate an image",
      action: () => handleSendMessage("Generate an image of a landscape"),
    },
    {
      id: "document",
      name: "/document",
      description: "Create a document",
      action: () => handleSendMessage("Create a document about AI"),
    },
  ]

  // Handle click outside to close commands dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (commandsRef.current && !commandsRef.current.contains(event.target as Node)) {
        setShowCommands(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)

    // Show commands when user types "/"
    if (value === "/") {
      setShowCommands(true)
    } else if (value.charAt(0) !== "/" || value.includes(" ")) {
      setShowCommands(false)
    }
  }

  // Simulate generating different types of artifacts
  const generateArtifact = (content: string) => {
    setIsGenerating(true)

    // Simulate API delay
    setTimeout(() => {
      let artifact: Artifact | null = null

      if (content.toLowerCase().includes("code") || content.toLowerCase().includes("component")) {
        artifact = {
          id: Date.now().toString(),
          type: "code",
          title: "React Button Component",
          content: `import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  onClick 
}) => {
  const baseStyles = 'font-medium rounded focus:outline-none';
  
  const variantStyles = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
  };
  
  const sizeStyles = {
    small: 'py-1 px-2 text-sm',
    medium: 'py-2 px-4',
    large: 'py-3 px-6 text-lg',
  };
  
  return (
    <button
      className={\`\${baseStyles} \${variantStyles[variant]} \${sizeStyles[size]}\`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;`,
        }
      } else if (content.toLowerCase().includes("image")) {
        artifact = {
          id: Date.now().toString(),
          type: "image",
          title: "Generated Landscape Image",
          content: (
            <div className="flex items-center justify-center bg-gray-100 rounded-lg p-4">
              <img src="/mountain-lake-vista.png" alt="Generated landscape" className="rounded-lg shadow-md" />
            </div>
          ),
        }
      } else if (content.toLowerCase().includes("document")) {
        artifact = {
          id: Date.now().toString(),
          type: "text",
          title: "AI Document",
          content: `# Introduction to Artificial Intelligence

Artificial Intelligence (AI) refers to the simulation of human intelligence in machines that are programmed to think and learn like humans. The term may also be applied to any machine that exhibits traits associated with a human mind such as learning and problem-solving.

## Key Areas of AI

1. **Machine Learning**: A method of data analysis that automates analytical model building.
2. **Neural Networks**: Computing systems vaguely inspired by the biological neural networks that constitute animal brains.
3. **Natural Language Processing**: The ability of a computer program to understand human language as it is spoken.
4. **Robotics**: The branch of technology that deals with the design, construction, operation, and application of robots.

## Applications of AI

AI has a wide range of applications across various industries:

- **Healthcare**: Disease diagnosis, personalized treatment, drug discovery
- **Finance**: Fraud detection, algorithmic trading, risk assessment
- **Transportation**: Autonomous vehicles, traffic management, route optimization
- **Customer Service**: Chatbots, recommendation systems, personalized marketing

## Ethical Considerations

As AI continues to advance, several ethical considerations arise:

- **Privacy**: How is data collected and used?
- **Bias**: Are AI systems fair and unbiased?
- **Accountability**: Who is responsible when AI makes mistakes?
- **Employment**: How will AI affect jobs and the workforce?

## The Future of AI

The future of AI holds immense potential for transforming society. Continued research and development in areas such as general AI, quantum computing, and brain-computer interfaces will likely lead to breakthroughs we cannot yet imagine.`,
        }
      }

      setCurrentArtifact(artifact)
      setIsGenerating(false)
      setShowRightPanel(true)
    }, 2000)
  }

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return

    // Add user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
      hasArtifact:
        content.toLowerCase().includes("code") ||
        content.toLowerCase().includes("image") ||
        content.toLowerCase().includes("document") ||
        content.toLowerCase().includes("generate") ||
        content.toLowerCase().includes("create"),
    }

    setMessages((prev) => [...prev, newUserMessage])

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `I've processed your request: "${content}"`,
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])

      // Generate artifact if the message suggests creating something
      if (newUserMessage.hasArtifact) {
        generateArtifact(content)
      }
    }, 1000)

    setInputValue("")
    setShowCommands(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !showCommands) {
      e.preventDefault()
      handleSendMessage(inputValue)
    }
  }

  const executeCommand = (command: SlashCommand) => {
    command.action()
    setInputValue("")
    setShowCommands(false)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-[1200px] h-[80vh] flex gap-4">
        {/* Left side - Chat */}
        <Card className="flex-1 flex flex-col min-w-[320px]">
          <CardHeader className="border-b">
            <CardTitle className="text-xl">Chat Interface</CardTitle>
          </CardHeader>

          <CardContent className="flex-grow overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`flex items-start gap-2 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : ""}`}
                >
                  <Avatar className="h-8 w-8">
                    <div
                      className={`h-full w-full flex items-center justify-center ${message.sender === "user" ? "bg-blue-500" : "bg-gray-500"}`}
                    >
                      {message.sender === "user" ? "U" : "AI"}
                    </div>
                  </Avatar>
                  <div
                    className={`rounded-lg p-3 ${message.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                  >
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>

          <CardFooter className="border-t p-4 relative">
            <div className="flex w-full gap-2">
              <div className="relative flex-grow" ref={commandsRef}>
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message or / for commands..."
                  className="w-full"
                />

                {showCommands && (
                  <div className="absolute bottom-full mb-2 w-full z-10">
                    <Command className="rounded-lg border shadow-md">
                      <CommandList>
                        <CommandGroup heading="Available Commands">
                          {slashCommands.map((command) => (
                            <CommandItem
                              key={command.id}
                              onSelect={() => executeCommand(command)}
                              className="cursor-pointer"
                            >
                              <div className="flex flex-col">
                                <span className="font-medium">{command.name}</span>
                                <span className="text-sm text-gray-500">{command.description}</span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </div>
                )}
              </div>

              <Button onClick={() => handleSendMessage(inputValue)} disabled={!inputValue.trim()}>
                Send
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Right side - Response/Artifact Panel */}
        {showRightPanel && (
          <Card className="flex-1 flex flex-col min-w-[320px] overflow-hidden">
            <CardHeader className="border-b">
              <CardTitle className="text-xl flex items-center justify-between">
                {currentArtifact ? <span>{currentArtifact.title}</span> : <span>AI Response</span>}
                <Button variant="outline" size="sm" onClick={() => setShowRightPanel(false)}>
                  Close
                </Button>
              </CardTitle>
            </CardHeader>

            <CardContent className="flex-grow overflow-y-auto p-4">
              {isGenerating ? (
                <div className="h-full flex flex-col items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-500 mb-2" />
                  <p className="text-gray-500">Generating content...</p>
                </div>
              ) : currentArtifact ? (
                <div className="h-full">
                  {currentArtifact.type === "code" && (
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto h-full">
                      <pre className="font-mono text-sm">
                        <code>{currentArtifact.content as string}</code>
                      </pre>
                    </div>
                  )}
                  {currentArtifact.type === "image" && (
                    <div className="h-full flex items-center justify-center">{currentArtifact.content}</div>
                  )}
                  {currentArtifact.type === "text" && (
                    <div className="prose max-w-none">
                      <div className="whitespace-pre-wrap">{currentArtifact.content as string}</div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">No content to display</p>
                </div>
              )}
            </CardContent>

            {currentArtifact && (
              <CardFooter className="border-t p-4">
                <div className="flex justify-between w-full">
                  <div className="flex items-center gap-2">
                    {currentArtifact.type === "code" && <Code className="h-5 w-5 text-gray-500" />}
                    {currentArtifact.type === "image" && <ImageIcon className="h-5 w-5 text-gray-500" />}
                    {currentArtifact.type === "text" && <FileText className="h-5 w-5 text-gray-500" />}
                    <span className="text-sm text-gray-500 capitalize">{currentArtifact.type}</span>
                  </div>
                  <Button size="sm">Download</Button>
                </div>
              </CardFooter>
            )}
          </Card>
        )}
      </div>
    </div>
  )
}
