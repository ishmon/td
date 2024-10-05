import React, { useState } from 'react';
import { Plus, X, User, UserCircle, Users, Flame, Check, Home } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const difficultyLevels = [
  { name: 'Tame', color: 'bg-green-500', icon: <Flame size={20} /> },
  { name: 'Spicy', color: 'bg-yellow-500', icon: <Flame size={24} /> },
  { name: 'Adult', color: 'bg-orange-500', icon: <Flame size={28} /> },
  { name: 'XXX', color: 'bg-red-500', icon: <Flame size={32} /> },
];

const PlayerCard = ({ player, onRemove }) => (
  <Card className="p-4 mb-2 flex items-center justify-between bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow">
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
        player.gender === 'male' ? 'bg-blue-100' : 
        player.gender === 'female' ? 'bg-pink-100' : 
        'bg-gray-100'
      }`}>
        <UserCircle className={
          player.gender === 'male' ? 'text-blue-500' : 
          player.gender === 'female' ? 'text-pink-500' : 
          'text-gray-500'
        } />
      </div>
      <span className="font-medium">{player.name}</span>
    </div>
    <Button variant="ghost" size="icon" onClick={() => onRemove(player.id)}
      className="text-gray-500 hover:text-red-500 transition-colors">
      <X size={20} />
    </Button>
  </Card>
);

const AddPlayerModal = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');

  const handleSubmit = () => {
    if (name && gender) {
      onAdd({ name, gender, id: Date.now() });
      setName('');
      setGender('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Player</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            placeholder="Enter player name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="col-span-3"
          />
          <div className="flex gap-2 justify-center">
            {[
              { value: 'male', label: 'Male', color: 'text-blue-500' },
              { value: 'female', label: 'Female', color: 'text-pink-500' },
              { value: 'other', label: 'Other', color: 'text-gray-500' }
            ].map((g) => (
              <Button
                key={g.value}
                onClick={() => setGender(g.value)}
                variant={gender === g.value ? 'default' : 'outline'}
                className="w-24"
              >
                <UserCircle className={g.color} />
                <span className="ml-2">{g.label}</span>
              </Button>
            ))}
          </div>
          <Button onClick={handleSubmit} disabled={!name || !gender}>
            Add Player
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const TruthOrDare = () => {
  const [players, setPlayers] = useState([]);
  const [difficulty, setDifficulty] = useState(null);
  const [isAddingPlayer, setIsAddingPlayer] = useState(false);
  const [gamePhase, setGamePhase] = useState('setup');
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [selectedChoice, setSelectedChoice] = useState(null);

  const handleAddPlayer = (player) => {
    setPlayers([...players, player]);
  };

  const handleRemovePlayer = (id) => {
    setPlayers(players.filter(p => p.id !== id));
  };

  const startGame = () => {
    if (players.length >= 2 && difficulty !== null) {
      setGamePhase('selection');
      setCurrentPlayer(players[0]);
    }
  };

  const resetGame = () => {
    if (window.confirm('Are you sure you want to go back to the start? Current game progress will be lost.')) {
      setPlayers([]);
      setDifficulty(null);
      setIsAddingPlayer(false);
      setGamePhase('setup');
      setCurrentPlayer(null);
      setSelectedChoice(null);
    }
  };

  const renderSetupPhase = () => (
    <div className="max-w-md mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-purple-600">
        Who Wants to Play?
      </h1>

      <div className="space-y-4">
        <Button
          onClick={() => setIsAddingPlayer(true)}
          className="w-full bg-purple-500 hover:bg-purple-600 text-white"
        >
          <Plus className="mr-2" /> Add Player
        </Button>

        <div className="space-y-2">
          {players.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              onRemove={handleRemovePlayer}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-center">Select Difficulty</h2>
        <div className="grid grid-cols-2 gap-2">
          {difficultyLevels.map((level) => (
            <Button
              key={level.name}
              onClick={() => setDifficulty(level.name)}
              className={`${
                difficulty === level.name ? level.color : 'bg-gray-200'
              } hover:opacity-90 transition-opacity`}
            >
              {level.icon}
              <span className="ml-2">{level.name}</span>
            </Button>
          ))}
        </div>
      </div>

      <Button
        onClick={startGame}
        disabled={players.length < 2 || !difficulty}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 rounded-lg text-lg font-semibold animate-pulse"
      >
        Start Game
      </Button>

      <AddPlayerModal
        isOpen={isAddingPlayer}
        onClose={() => setIsAddingPlayer(false)}
        onAdd={handleAddPlayer}
      />
    </div>
  );

  const renderSelectionPhase = () => (
    <div className="max-w-md mx-auto p-4 space-y-6 text-center">
      <h1 className="text-3xl font-bold mb-8">
        It's {currentPlayer?.name}'s Turn!
      </h1>
      <div className="grid grid-cols-2 gap-4">
        <Button
          onClick={() => {
            setSelectedChoice('truth');
            setGamePhase('question');
          }}
          className="h-32 text-xl font-bold bg-blue-500 hover:bg-blue-600 transition-colors"
        >
          Truth
        </Button>
        <Button
          onClick={() => {
            setSelectedChoice('dare');
            setGamePhase('question');
          }}
          className="h-32 text-xl font-bold bg-red-500 hover:bg-red-600 transition-colors"
        >
          Dare
        </Button>
      </div>
    </div>
  );

  const renderQuestionPhase = () => (
    <div className="max-w-md mx-auto p-4 space-y-6 text-center">
      <h1 className="text-3xl font-bold mb-8">
        Here's Your {selectedChoice === 'truth' ? 'Truth' : 'Dare'}!
      </h1>
      <Card className="p-6 text-xl font-medium">
        {selectedChoice === 'truth' 
          ? "What's your most embarrassing moment?" 
          : "Dance like nobody's watching for 30 seconds!"}
      </Card>
      <div className="grid grid-cols-2 gap-4">
        <Button
          onClick={() => setGamePhase('selection')}
          className="bg-green-500 hover:bg-green-600"
        >
          <Check className="mr-2" /> Completed
        </Button>
        <Button
          onClick={() => setGamePhase('selection')}
          className="bg-red-500 hover:bg-red-600"
        >
          <X className="mr-2" /> Failed
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 py-8 relative">
      {gamePhase !== 'setup' && (
        <Button
          variant="outline"
          size="icon"
          onClick={resetGame}
          className="fixed top-4 right-4 rounded-full w-12 h-12 bg-white shadow-md hover:shadow-lg transition-all"
        >
          <Home className="h-6 w-6" />
        </Button>
      )}
      {gamePhase === 'setup' && renderSetupPhase()}
      {gamePhase === 'selection' && renderSelectionPhase()}
      {gamePhase === 'question' && renderQuestionPhase()}
    </div>
  );
};

export default TruthOrDare;
