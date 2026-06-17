"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

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
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuestion = async () => {
    try {
      await createQuestion(assessmentId, form);
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

      fetchQuestions();
    } catch (error) {
      console.error(error);
    }
  };
  const handleUpdateQuestion = async () => {
    if (!editingQuestionId) return;

    try {
      await updateQuestion(editingQuestionId, form);

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

      fetchQuestions();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      await deleteQuestion(questionId);

      fetchQuestions();
    } catch (error) {
      console.error(error);
    }
  };

  // const handleDeleteQuestions=async(questionId:string)

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Quiz Questions</h1>

          <p className="text-gray-500 dark:text-gray-400">
            Total Questions: {questions.length}
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="
            bg-blue-600
            text-white
            px-4
            py-2
            rounded-lg
            "
        >
          + Add Question
        </button>
      </div>

      {showForm && (
        <div
          className="
            bg-white
            dark:bg-zinc-900
            border
            dark:border-zinc-800
            rounded-xl
            p-6
            mb-8
            "
        >
          <input
            value={form.question}
            placeholder="Question"
            className="w-full border p-3 rounded mb-3"
            onChange={(e) =>
              setForm({
                ...form,
                question: e.target.value,
              })
            }
          />

          <input
            value={form.option_a}
            placeholder="Option A"
            className="w-full border p-3 rounded mb-3"
            onChange={(e) =>
              setForm({
                ...form,
                option_a: e.target.value,
              })
            }
          />

          <input
            value={form.option_b}
            placeholder="Option B"
            className="w-full border p-3 rounded mb-3"
            onChange={(e) =>
              setForm({
                ...form,
                option_b: e.target.value,
              })
            }
          />

          <input
            value={form.option_c}
            placeholder="Option C"
            className="w-full border p-3 rounded mb-3"
            onChange={(e) =>
              setForm({
                ...form,
                option_c: e.target.value,
              })
            }
          />

          <input
            value={form.option_d}
            placeholder="Option D"
            className="w-full border p-3 rounded mb-3"
            onChange={(e) =>
              setForm({
                ...form,
                option_d: e.target.value,
              })
            }
          />
          <select
            value={form.correct_answer}
            onChange={(e) =>
              setForm({
                ...form,
                correct_answer: e.target.value,
              })
            }
            className="w-full border p-3 rounded mb-3"
          >
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>

          <input
            type="number"
            value={form.marks}
            placeholder="Marks"
            className="w-full border p-3 rounded mb-3"
            onChange={(e) =>
              setForm({
                ...form,
                marks: Number(e.target.value),
              })
            }
          />

          <select
            value={form.difficulty}
            onChange={(e) =>
              setForm({
                ...form,
                difficulty: e.target.value,
              })
            }
            className="w-full border p-3 rounded mb-3"
          >
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
          <button
            onClick={handleCreateQuestion}
            className="
  bg-green-600
  hover:bg-green-700
  text-white
  px-4
  py-2
  rounded-lg
  "
          >
            Save Question
          </button>
        </div>
      )}

      <div className="space-y-4">
        {questions.map((question, index) => (
          <div
            key={question.id}
            className="
                bg-white
                dark:bg-zinc-900
                border
                dark:border-zinc-800
                rounded-xl
                p-6
                "
          >
            <h2 className="font-bold mb-4">
              Q{index + 1}. {question.question}
            </h2>

            <div className="space-y-2">
              <p>A. {question.option_a}</p>

              <p>B. {question.option_b}</p>

              <p>C. {question.option_c}</p>

              <p>D. {question.option_d}</p>
            </div>

            <div className="mt-4 flex gap-4">
              <span>Answer: {question.correct_answer}</span>

              <span>Marks: {question.marks}</span>
            </div>

            <div className="mt-4 flex gap-2">
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
  bg-yellow-500
  hover:bg-yellow-600
  text-white
  px-3
  py-1
  rounded
  transition
  "
              >
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
                    bg-red-600
                    text-white
                    px-3
                    py-1
                    rounded
                    "
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {isEditModalOpen && (
        <div
          className="
      fixed
      inset-0
      bg-black/60
      flex
      items-center
      justify-center
      z-50
    "
        >
          <div
            className="
        bg-white
        dark:bg-zinc-900
        border
        border-gray-200
        dark:border-zinc-800
        rounded-2xl
        p-6
        w-full
        max-w-2xl
        mx-4
        shadow-xl
      "
          >
            <h2 className="text-2xl font-bold mb-6">Edit Question</h2>

            <input
              value={form.question}
              placeholder="Question"
              className="w-full border p-3 rounded mb-3"
              onChange={(e) =>
                setForm({
                  ...form,
                  question: e.target.value,
                })
              }
            />

            <input
              value={form.option_a}
              placeholder="Option A"
              className="w-full border p-3 rounded mb-3"
              onChange={(e) =>
                setForm({
                  ...form,
                  option_a: e.target.value,
                })
              }
            />

            <input
              value={form.option_b}
              placeholder="Option B"
              className="w-full border p-3 rounded mb-3"
              onChange={(e) =>
                setForm({
                  ...form,
                  option_b: e.target.value,
                })
              }
            />

            <input
              value={form.option_c}
              placeholder="Option C"
              className="w-full border p-3 rounded mb-3"
              onChange={(e) =>
                setForm({
                  ...form,
                  option_c: e.target.value,
                })
              }
            />

            <input
              value={form.option_d}
              placeholder="Option D"
              className="w-full border p-3 rounded mb-3"
              onChange={(e) =>
                setForm({
                  ...form,
                  option_d: e.target.value,
                })
              }
            />

            <select
              value={form.correct_answer}
              onChange={(e) =>
                setForm({
                  ...form,
                  correct_answer: e.target.value,
                })
              }
              className="w-full border p-3 rounded mb-3"
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>

            <input
              type="number"
              value={form.marks}
              className="w-full border p-3 rounded mb-3"
              onChange={(e) =>
                setForm({
                  ...form,
                  marks: Number(e.target.value),
                })
              }
            />

            <select
              value={form.difficulty}
              onChange={(e) =>
                setForm({
                  ...form,
                  difficulty: e.target.value,
                })
              }
              className="w-full border p-3 rounded mb-6"
            >
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="
            px-4
            py-2
            rounded-lg
            border
            border-gray-300
            dark:border-zinc-700
          "
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  await handleUpdateQuestion();
                  setIsEditModalOpen(false);
                }}
                className="
            px-4
            py-2
            rounded-lg
            bg-yellow-500
            hover:bg-yellow-600
            text-white
          "
              >
                Update Question
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
