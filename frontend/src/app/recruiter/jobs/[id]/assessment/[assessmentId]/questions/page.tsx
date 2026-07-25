"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  FileQuestion,
  PlusCircle,
  Circle,
  CheckCircle2,
  Award,
  Gauge,
  Save,
  CircleCheck,
  Trophy,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { toastApiWarning } from "@/lib/toast";
import { validateQuestion } from "@/lib/validation";

import {
  getQuestions,
  createQuestion,
  deleteQuestion,
  updateQuestion,
} from "@/services/assessment.services";

interface Question {
  id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  marks: number;
  difficulty: string;
}

export default function QuestionsPage() {
  const params = useParams();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const assessmentId = params.assessmentId as string;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(
    null,
  );

  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    question: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_answer: "A",
    marks: 1,
    difficulty: "EASY",
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await getQuestions(assessmentId);

      setQuestions(res.data || []);
    } catch (error) {
      console.error(error);
      toastApiWarning(error, "Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuestion = async () => {
    const validation = validateQuestion(form);
    if (!validation.valid) {
      toast.error(validation.message);
      return;
    }
    try {
      await createQuestion(assessmentId, validation.data);
      setForm({
        question: "",
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",
        correct_answer: "A",
        marks: 1,
        difficulty: "EASY",
      });

      setShowForm(false);

      toast.success("Question created successfully");
      fetchQuestions();
    } catch (error) {
      console.error(error);
      toastApiWarning(error, "Failed to create question");
    }
  };
  const handleUpdateQuestion = async () => {
    if (!editingQuestionId) return;
    const validation = validateQuestion(form);
    if (!validation.valid) {
      toast.error(validation.message);
      return;
    }

    try {
      await updateQuestion(editingQuestionId, validation.data);

      setEditingQuestionId(null);

      setShowForm(false);

      setForm({
        question: "",
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",
        correct_answer: "A",
        marks: 1,
        difficulty: "EASY",
      });

      toast.success("Question updated successfully");
      fetchQuestions();
    } catch (error) {
      console.error(error);
      toastApiWarning(error, "Failed to update question");
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      await deleteQuestion(questionId);

      toast.success("Question deleted successfully");
      fetchQuestions();
    } catch (error) {
      console.error(error);
      toastApiWarning(error, "Failed to delete question");
    }
  };

  // const handleDeleteQuestions=async(questionId:string)

  if (loading) {
    return <div className="p-4 sm:p-8">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-6xl p-3 sm:p-5 lg:p-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
        {/* Left */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div
            className="
        h-14
        w-14
        shrink-0
        sm:h-16
        sm:w-16
        rounded-2xl
        bg-gradient-to-br
        from-blue-600
        to-indigo-600
        flex
        items-center
        justify-center
        text-white
        shadow-lg
      "
          >
            <FileQuestion size={30} />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white lg:text-4xl">
              Quiz Questions
            </h1>

            <p className="mt-1 text-gray-500 dark:text-gray-400">
              Create and organize questions for this assessment.
            </p>

            <div
              className="
          inline-flex
          items-center
          mt-3
          rounded-full
          bg-blue-50
          dark:bg-blue-900/20
          px-4
          py-1.5
          text-sm
          font-medium
          text-blue-700
          dark:text-blue-300
        "
            >
              Total Questions: {questions.length}
            </div>
          </div>
        </div>

        {/* Right */}

        <button
          onClick={() => setShowForm(!showForm)}
          className="
      inline-flex
      w-full
      items-center
      justify-center
      gap-2
      rounded-xl
      bg-gradient-to-r
      from-blue-600
      to-indigo-600
      px-6
      py-3
      text-white
      font-semibold
      shadow-lg
      hover:shadow-xl
      hover:scale-105
      transition-all
      duration-300
      sm:w-auto
    "
        >
          <PlusCircle size={20} />

          {showForm ? "Close Form" : "Add Question"}
        </button>
      </div>

      {showForm && (
        <div
          className="
    mb-10
    overflow-hidden
    rounded-3xl
    border
    border-gray-200
    dark:border-gray-800
    bg-white
    dark:bg-gray-900
    shadow-xl
  "
        >
          {/* Header */}

          <div className="border-b border-gray-200 p-4 dark:border-gray-800 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div
                className="
          h-14
          w-14
          rounded-2xl
          bg-gradient-to-br
          from-blue-600
          to-indigo-600
          flex
          items-center
          justify-center
          text-white
        "
              >
                <FileQuestion size={26} />
              </div>

              <div>
                <h2 className="text-2xl font-bold">Create Question</h2>

                <p className="text-gray-500 dark:text-gray-400">
                  Add a multiple choice question to this assessment.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}

          <div className="space-y-6 p-4 sm:p-6 lg:p-8">
            {/* Question */}

            <div>
              <label className="block mb-2 font-medium">Question</label>

              <textarea
                rows={3}
                value={form.question}
                placeholder="Enter your question..."
                onChange={(e) =>
                  setForm({
                    ...form,
                    question: e.target.value,
                  })
                }
                className="
          w-full
          rounded-xl
          border
          border-gray-300
          dark:border-gray-700
          bg-gray-50
          dark:bg-gray-800
          p-4
          outline-none
          focus:ring-2
          focus:ring-blue-500
        "
              />
            </div>

            {/* Options */}

            <div>
              <h3 className="font-semibold mb-4">Answer Options</h3>

              <div className="grid gap-4 md:grid-cols-2">
                <input
                  value={form.option_a}
                  placeholder="Option A"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      option_a: e.target.value,
                    })
                  }
                  className="rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

                <input
                  value={form.option_b}
                  placeholder="Option B"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      option_b: e.target.value,
                    })
                  }
                  className="rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

                <input
                  value={form.option_c}
                  placeholder="Option C"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      option_c: e.target.value,
                    })
                  }
                  className="rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

                <input
                  value={form.option_d}
                  placeholder="Option D"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      option_d: e.target.value,
                    })
                  }
                  className="rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Settings */}

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="block mb-2 font-medium">Correct Answer</label>

                <select
                  value={form.correct_answer}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      correct_answer: e.target.value,
                    })
                  }
                  className="
            w-full
            rounded-xl
            border
            border-gray-300
            dark:border-gray-700
            bg-gray-50
            dark:bg-gray-800
            p-3
            outline-none
          "
                >
                  <option value="A">Option A</option>
                  <option value="B">Option B</option>
                  <option value="C">Option C</option>
                  <option value="D">Option D</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 font-medium">Marks</label>

                <input
                  type="number"
                  min={1}
                  max={100}
                  step={1}
                  value={form.marks}
                  placeholder="5"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      marks: Number(e.target.value),
                    })
                  }
                  className="
            w-full
            rounded-xl
            border
            border-gray-300
            dark:border-gray-700
            bg-gray-50
            dark:bg-gray-800
            p-3
            outline-none
          "
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Difficulty</label>

                <select
                  value={form.difficulty}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      difficulty: e.target.value,
                    })
                  }
                  className="
            w-full
            rounded-xl
            border
            border-gray-300
            dark:border-gray-700
            bg-gray-50
            dark:bg-gray-800
            p-3
            outline-none
          "
                >
                  <option value="EASY">🟢 Easy</option>
                  <option value="MEDIUM">🟡 Medium</option>
                  <option value="HARD">🔴 Hard</option>
                </select>
              </div>
            </div>

            {/* Footer */}

            <div className="flex border-t border-gray-200 pt-4 dark:border-gray-800 sm:justify-end">
              <button
                onClick={handleCreateQuestion}
                className="
          inline-flex
          w-full
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-gradient-to-r
          from-green-600
          to-emerald-600
          px-7
          py-3
          text-white
          font-semibold
          shadow-lg
          hover:scale-105
          hover:shadow-xl
          transition-all
          sm:w-auto
        "
              >
                <Save size={18} />
                Save Question
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {questions.map((question, index) => (
          <div
            key={question.id}
            className="
        overflow-hidden
        rounded-3xl
        border
        border-gray-200
        dark:border-gray-800
        bg-white
        dark:bg-gray-900
        shadow-md
        hover:shadow-xl
        transition-all
        duration-300
      "
          >
            <div className="p-4 sm:p-6 lg:p-7">
              {/* Header */}

              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <div className="mb-3 flex items-start gap-3">
                    <span
                      className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-gradient-to-r
                  from-blue-600
                  to-indigo-600
                  text-white
                  font-bold
                "
                    >
                      {index + 1}
                    </span>

                    <h2 className="break-words text-lg font-bold sm:text-xl">{question.question}</h2>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span
                    className={`
                rounded-full
                px-3
                py-1
                text-xs
                font-semibold
                ${
                  question.difficulty === "EASY"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                    : question.difficulty === "MEDIUM"
                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                }
              `}
                  >
                    <Gauge size={14} className="inline mr-1" />
                    {question.difficulty}
                  </span>

                  <span
                    className="
                rounded-full
                bg-blue-100
                dark:bg-blue-900/20
                px-3
                py-1
                text-xs
                font-semibold
                text-blue-700
                dark:text-blue-400
              "
                  >
                    <Trophy size={14} className="inline mr-1" />
                    {question.marks} Marks
                  </span>
                </div>
              </div>

              {/* Options */}

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {[
                  ["A", question.option_a],
                  ["B", question.option_b],
                  ["C", question.option_c],
                  ["D", question.option_d],
                ].map(([label, option]) => {
                  const correct = label === question.correct_answer;

                  return (
                    <div
                      key={label}
                      className={`
                  rounded-xl
                  border
                  p-4
                  transition
                  ${
                    correct
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                  }
                `}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-full
                      font-semibold
                      ${
                        correct
                          ? "bg-green-600 text-white"
                          : "bg-gray-200 dark:bg-gray-700"
                      }
                    `}
                        >
                          {label}
                        </div>

                        <p className="flex-1">{option}</p>

                        {correct && (
                          <CircleCheck className="text-green-600" size={20} />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}

              <div
                className="
            mt-7
            flex
            flex-col
            md:flex-row
            md:items-center
            md:justify-between
            gap-4
            border-t
            border-gray-200
            dark:border-gray-800
            pt-5
          "
              >
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Correct Answer:
                  <span className="ml-2 font-semibold text-green-600">
                    Option {question.correct_answer}
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 md:flex">
                  <button
                    onClick={() => {
                      setEditingQuestionId(question.id);

                      setForm({
                        question: question.question,
                        option_a: question.option_a,
                        option_b: question.option_b,
                        option_c: question.option_c,
                        option_d: question.option_d,
                        correct_answer: question.correct_answer,
                        marks: question.marks,
                        difficulty: question.difficulty,
                      });

                      setIsEditModalOpen(true);
                    }}
                    className="
                inline-flex
                justify-center
                items-center
                gap-2
                rounded-xl
                bg-gradient-to-r
                from-yellow-500
                to-orange-500
                px-5
                py-2.5
                text-white
                font-medium
                hover:scale-105
                transition
              "
                  >
                    <Pencil size={16} />
                    Edit
                  </button>

                  <button
                    onClick={() => {
                      const confirmed = window.confirm("Delete this question?");

                      if (confirmed) {
                        handleDeleteQuestion(question.id);
                      }
                    }}
                    className="
                inline-flex
                justify-center
                items-center
                gap-2
                rounded-xl
                border
                border-red-300
                dark:border-red-700
                px-5
                py-2.5
                text-red-600
                hover:bg-red-50
                dark:hover:bg-red-900/20
                transition
              "
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {isEditModalOpen && (
        <div
          className="
    fixed
    inset-0
    z-50
    flex
    items-center
    justify-center
    bg-black/70
    backdrop-blur-sm
    p-4
  "
        >
          <div
            className="
      w-full
      max-w-3xl
      overflow-hidden
      rounded-3xl
      border
      border-gray-200
      dark:border-gray-800
      bg-white
      dark:bg-gray-900
      shadow-2xl
    "
          >
            {/* Header */}

            <div className="border-b border-gray-200 p-4 dark:border-gray-800 sm:p-6 lg:p-7">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div
                  className="
            h-14
            w-14
            rounded-2xl
            bg-gradient-to-r
            from-yellow-500
            to-orange-500
            flex
            items-center
            justify-center
            text-white
          "
                >
                  <Pencil size={26} />
                </div>

                <div>
                  <h2 className="text-2xl font-bold sm:text-3xl">Edit Question</h2>

                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    Modify the question, options and grading details.
                  </p>
                </div>
              </div>
            </div>

            {/* Body */}

            <div className="max-h-[70dvh] space-y-6 overflow-y-auto p-4 sm:p-6 lg:p-8">
              {/* Question */}

              <div>
                <label className="block mb-2 font-medium">Question</label>

                <textarea
                  rows={3}
                  value={form.question}
                  placeholder="Enter question..."
                  onChange={(e) =>
                    setForm({
                      ...form,
                      question: e.target.value,
                    })
                  }
                  className="
            w-full
            rounded-xl
            border
            border-gray-300
            dark:border-gray-700
            bg-gray-50
            dark:bg-gray-800
            p-4
            outline-none
            focus:ring-2
            focus:ring-yellow-500
          "
                />
              </div>

              {/* Options */}

              <div>
                <h3 className="font-semibold mb-4">Answer Options</h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    value={form.option_a}
                    placeholder="Option A"
                    onChange={(e) =>
                      setForm({ ...form, option_a: e.target.value })
                    }
                    className="rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 outline-none focus:ring-2 focus:ring-yellow-500"
                  />

                  <input
                    value={form.option_b}
                    placeholder="Option B"
                    onChange={(e) =>
                      setForm({ ...form, option_b: e.target.value })
                    }
                    className="rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 outline-none focus:ring-2 focus:ring-yellow-500"
                  />

                  <input
                    value={form.option_c}
                    placeholder="Option C"
                    onChange={(e) =>
                      setForm({ ...form, option_c: e.target.value })
                    }
                    className="rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 outline-none focus:ring-2 focus:ring-yellow-500"
                  />

                  <input
                    value={form.option_d}
                    placeholder="Option D"
                    onChange={(e) =>
                      setForm({ ...form, option_d: e.target.value })
                    }
                    className="rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
              </div>

              {/* Settings */}

              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className="block mb-2 font-medium">
                    Correct Answer
                  </label>

                  <select
                    value={form.correct_answer}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        correct_answer: e.target.value,
                      })
                    }
                    className="
              w-full
              rounded-xl
              border
              border-gray-300
              dark:border-gray-700
              bg-gray-50
              dark:bg-gray-800
              p-3
              outline-none
            "
                  >
                    <option value="A">Option A</option>
                    <option value="B">Option B</option>
                    <option value="C">Option C</option>
                    <option value="D">Option D</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 font-medium">Marks</label>

                  <input
                    type="number"
                    min={1}
                    max={100}
                    step={1}
                    value={form.marks}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        marks: Number(e.target.value),
                      })
                    }
                    className="
              w-full
              rounded-xl
              border
              border-gray-300
              dark:border-gray-700
              bg-gray-50
              dark:bg-gray-800
              p-3
              outline-none
            "
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">Difficulty</label>

                  <select
                    value={form.difficulty}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        difficulty: e.target.value,
                      })
                    }
                    className="
              w-full
              rounded-xl
              border
              border-gray-300
              dark:border-gray-700
              bg-gray-50
              dark:bg-gray-800
              p-3
              outline-none
            "
                  >
                    <option value="EASY">🟢 Easy</option>
                    <option value="MEDIUM">🟡 Medium</option>
                    <option value="HARD">🔴 Hard</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Footer */}

            <div
              className="
        border-t
        border-gray-200
        dark:border-gray-800
        p-4
        sm:p-6
        grid
        gap-3
        sm:flex
        sm:justify-end
        sm:gap-4
      "
            >
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="
          inline-flex
          justify-center
          items-center
          gap-2
          rounded-xl
          border
          border-gray-300
          dark:border-gray-700
          px-6
          py-3
          font-medium
          hover:bg-gray-100
          dark:hover:bg-gray-800
          transition
        "
              >
                <X size={18} />
                Cancel
              </button>

              <button
                onClick={async () => {
                  await handleUpdateQuestion();
                  setIsEditModalOpen(false);
                }}
                className="
          inline-flex
          justify-center
          items-center
          gap-2
          rounded-xl
          bg-gradient-to-r
          from-yellow-500
          to-orange-500
          px-7
          py-3
          text-white
          font-semibold
          shadow-lg
          hover:scale-105
          hover:shadow-xl
          transition-all
        "
              >
                <Save size={18} />
                Update Question
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
