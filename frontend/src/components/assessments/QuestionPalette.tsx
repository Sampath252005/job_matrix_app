interface Props {
  questions: any[];
  currentQuestion: number;
  answers: Record<string, string>;
  onSelect: (index: number) => void;
}

export default function QuestionPalette({
  questions,
  currentQuestion,
  answers,
  onSelect,
}: Props) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {questions.map((q, index) => (
        <button
          key={q.id}
          onClick={() => onSelect(index)}
          className={`
            h-10
            w-10
            rounded

            ${
              currentQuestion === index
                ? "bg-blue-600 text-white"
                : answers[q.id]
                ? "bg-green-600 text-white"
                : "bg-gray-200 dark:bg-zinc-800"
            }
          `}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
}