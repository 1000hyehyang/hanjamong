import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "../shared/components/AppLayout";
import { BookmarksPage } from "../features/bookmarks/BookmarksPage";
import { LearnListPage } from "../features/learn/LearnListPage";
import { LearnPage } from "../features/learn/LearnPage";
import { LearnSelectPage } from "../features/learn/LearnSelectPage";
import { QuizSelectPage } from "../features/quiz/QuizSelectPage";
import { QuizSetSelectPage } from "../features/quiz/QuizSetSelectPage";
import { QuizSessionPage } from "../features/quiz/QuizSessionPage";
import { QuizTypeSelectPage } from "../features/quiz/QuizTypeSelectPage";
import { WrongNotesPage } from "../features/wrong-notes/WrongNotesPage";
import { ConceptsSelectPage } from "../features/concepts/ConceptsSelectPage";
import { AntonymsListPage } from "../features/concepts/AntonymsListPage";
import { AntonymsPage } from "../features/concepts/AntonymsPage";
import { ConfusingHanjaListPage } from "../features/concepts/ConfusingHanjaListPage";
import { ConfusingHanjaPage } from "../features/concepts/ConfusingHanjaPage";
import { FormationPage } from "../features/concepts/FormationPage";
import { StrokeOrderPage } from "../features/concepts/StrokeOrderPage";
import { HomophonesListPage } from "../features/concepts/HomophonesListPage";
import { HomophonesPage } from "../features/concepts/HomophonesPage";
import { SynonymsListPage } from "../features/concepts/SynonymsListPage";
import { SynonymsPage } from "../features/concepts/SynonymsPage";

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
      { path: "/quiz/:grade/:type/sets", element: <QuizSetSelectPage /> },
      { path: "/quiz/:grade/:type/set/:setIndex", element: <QuizSessionPage /> },
      { path: "/quiz/:grade/:type", element: <QuizSessionPage /> },
      { path: "/bookmarks", element: <BookmarksPage /> },
      { path: "/wrong", element: <WrongNotesPage /> },
      { path: "/concepts", element: <ConceptsSelectPage /> },
      { path: "/concepts/stroke-order", element: <StrokeOrderPage /> },
      { path: "/concepts/formation", element: <FormationPage /> },
      { path: "/concepts/confusing-hanja/list", element: <ConfusingHanjaListPage /> },
      { path: "/concepts/confusing-hanja", element: <ConfusingHanjaPage /> },
      { path: "/concepts/synonyms/list", element: <SynonymsListPage /> },
      { path: "/concepts/synonyms", element: <SynonymsPage /> },
      { path: "/concepts/antonyms/list", element: <AntonymsListPage /> },
      { path: "/concepts/antonyms", element: <AntonymsPage /> },
      { path: "/concepts/homophones/list", element: <HomophonesListPage /> },
      { path: "/concepts/homophones", element: <HomophonesPage /> },
    ],
  },
]);
