import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import client from '../client.ts'
import { ApolloProvider } from '@apollo/client'

createRoot(document.getElementById('root')!).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)