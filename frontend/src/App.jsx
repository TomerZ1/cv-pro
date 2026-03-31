/**
 * Root application component.
 * Manages global state with useReducer, renders NavBar and routes.
 *
 * State stores raw section texts (pasted from CV) and JD data.
 * Each tool page has its own input textarea for that section.
 */

import { useReducer } from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import InputPage from "./pages/InputPage";
import ProjectsPage from "./pages/ProjectsPage";
import SkillsPage from "./pages/SkillsPage";
import ProfilePage from "./pages/ProfilePage";
import AchievementsPage from "./pages/AchievementsPage";

/**
 * @typedef {Object} AppState
 * @property {Object|null} jdData - Parsed JD data {raw_text, keywords}.
 * @property {string} jdText - Raw JD text for re-editing.
 * @property {Object} sectionTexts - Raw pasted CV text per section.
 * @property {Object} results - Tool results keyed by tool name.
 * @property {Object} loading - Loading flags keyed by tool name.
 * @property {Object} errors - Error messages keyed by tool name.
 */

/** @type {AppState} */
const initialState = {
  jdData: null,
  jdText: "",
  sectionTexts: {
    projects: "",
    skills: "",
    profile: "",
    achievements: "",
  },
  results: {
    projects: null,
    skills: null,
    profile: null,
    achievements: null,
  },
  loading: {
    projects: false,
    skills: false,
    profile: false,
    achievements: false,
  },
  errors: {
    jd: null,
    projects: null,
    skills: null,
    profile: null,
    achievements: null,
  },
};

/**
 * App state reducer — handles all state transitions.
 *
 * @param {AppState} state - Current state.
 * @param {Object} action - Dispatched action with type and payload.
 * @returns {AppState} New state.
 */
function reducer(state, action) {
  switch (action.type) {
    case "SET_JD_DATA":
      return { ...state, jdData: action.payload };

    case "SET_JD_TEXT":
      return { ...state, jdText: action.payload };

    case "SET_SECTION_TEXT":
      // Store raw pasted CV text for a specific section
      return {
        ...state,
        sectionTexts: {
          ...state.sectionTexts,
          [action.payload.key]: action.payload.value,
        },
      };

    case "SET_LOADING":
      return {
        ...state,
        loading: { ...state.loading, [action.payload.key]: action.payload.value },
      };

    case "SET_RESULTS":
      return {
        ...state,
        results: { ...state.results, [action.payload.key]: action.payload.value },
      };

    case "SET_ERROR":
      return {
        ...state,
        errors: { ...state.errors, [action.payload.key]: action.payload.message },
      };

    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <main className="max-w-5xl mx-auto px-4 py-8">
        <Routes>
          <Route
            path="/"
            element={
              <InputPage
                dispatch={dispatch}
                jdData={state.jdData}
                jdText={state.jdText}
              />
            }
          />
          <Route
            path="/projects"
            element={
              <ProjectsPage
                jdData={state.jdData}
                sectionText={state.sectionTexts.projects}
                results={state.results.projects}
                loading={state.loading.projects}
                error={state.errors.projects}
                dispatch={dispatch}
              />
            }
          />
          <Route
            path="/skills"
            element={
              <SkillsPage
                jdData={state.jdData}
                sectionText={state.sectionTexts.skills}
                results={state.results.skills}
                loading={state.loading.skills}
                error={state.errors.skills}
                dispatch={dispatch}
              />
            }
          />
          <Route
            path="/profile"
            element={
              <ProfilePage
                jdData={state.jdData}
                sectionText={state.sectionTexts.profile}
                results={state.results.profile}
                loading={state.loading.profile}
                error={state.errors.profile}
                dispatch={dispatch}
              />
            }
          />
          <Route
            path="/achievements"
            element={
              <AchievementsPage
                jdData={state.jdData}
                sectionText={state.sectionTexts.achievements}
                results={state.results.achievements}
                loading={state.loading.achievements}
                error={state.errors.achievements}
                dispatch={dispatch}
              />
            }
          />
        </Routes>
      </main>
    </div>
  );
}
