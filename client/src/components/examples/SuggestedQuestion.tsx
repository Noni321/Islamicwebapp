import SuggestedQuestion from '../SuggestedQuestion';

export default function SuggestedQuestionExample() {
  return (
    <div className="p-6 bg-background max-w-md">
      <SuggestedQuestion
        question="What is the purpose of life?"
        onClick={() => console.log('Question clicked')}
      />
    </div>
  );
}
