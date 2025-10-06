import WelcomeScreen from '../WelcomeScreen';

export default function WelcomeScreenExample() {
  return (
    <div className="h-screen bg-background flex flex-col">
      <WelcomeScreen onQuestionSelect={(q) => console.log('Selected:', q)} />
    </div>
  );
}
