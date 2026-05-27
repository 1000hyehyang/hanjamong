import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "../shared/components/AppLayout";
import { BookmarksPage } from "../features/bookmarks/BookmarksPage";
import { LearnListPage } from "../features/learn/LearnListPage";
import { LearnPage } from "../features/learn/LearnPage";
import { LearnSelectPage } from "../features/learn/LearnSelectPage";
import { QuizSelectPage } from "../features/quiz/QuizSelectPage";
import { QuizSessionPage } from "../features/quiz/QuizSessionPage";
import { QuizTypeSelectPage } from "../features/quiz/QuizTypeSelectPage";
import { WrongNotesPage } from "../features/wrong-notes/WrongNotesPage";
import { ConceptsSelectPage } from "../features/concepts/ConceptsSelectPage";
import { FormationPage } from "../features/concepts/FormationPage";
import { StrokeOrderPage } from "../features/concepts/StrokeOrderPage";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <LearnSelectPage /> },
      { path: "/learn", element: <Navigate to="/" replace /> },
      { path: "/learn/:grade/list", element: <LearnListPage /> },
      { path: "/learn/:grade", element: <LearnPage /> },
      { path: "/quiz", element: <QuizSelectPage /> },
      { path: "/quiz/review", element: <QuizSessionPage /> },
      { path: "/quiz/:grade", element: <QuizTypeSelectPage /> },
      { path: "/quiz/:grade/:type", element: <QuizSessionPage /> },
      { path: "/bookmarks", element: <BookmarksPage /> },
      { path: "/wrong", element: <WrongNotesPage /> },
      { path: "/concepts", element: <ConceptsSelectPage /> },
      { path: "/concepts/stroke-order", element: <StrokeOrderPage /> },
      { path: "/concepts/formation", element: <FormationPage /> },
    ],
  },
]);
