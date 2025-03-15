import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Tabs } from 'antd';
import MindMapGenerator from './MindMapGenerator';
import AppRouter from './AppRouter';
const onChange = (key) => {
  console.log(key);
};
function App() {
  return (
    <div className="app">
      <AppRouter />
    </div>
  );
}

export default App
