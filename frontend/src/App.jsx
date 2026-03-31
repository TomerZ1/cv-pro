/**
 * Root application component.
 * Manages global state with useReducer, renders NavBar and routes.
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
 * @property {Object|null} cvData - Structured CV data from input boxes.
 * @property {Object|null} jdData - Parsed JD data {raw_text, keywords}.
 * @property {string} jdText - Raw JD text for re-editing.
 * @property {Object} results - Tool results keyed by tool name.
 * @property {Object} loading - Loading flags keyed by tool name.
 * @property {Object} errors - Error messages keyed by tool name.
 */

/** @type {AppState} */
const initialState = {
  cvData: null,
  jdData: null,
  jdText: "",
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
    case "SET_CV_DATA":
      return { ...state, cvData: action.payload };

    case "SET_JD_DATA":
      return { ...state, jdData: action.payload };

    case "SET_JD_TEXT":
      return { ...state, jdText: action.payload };

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

    case "UPDATE_BULLET": {
      // Add a new variation to a specific bullet in the projects results
      const { projectKey, bulletIndex, newVariation } = action.payload;
      const currentResults = state.results.projects;

      if (!currentResults?.projects?.[projectKey]) return state;

      const updatedBullets = [...currentResults.projects[projectKey].bullets];
      const bullet = updatedBullets[bulletIndex];

      // Add the new variation to the front of the list
      updatedBullets[bulletIndex] = {
        ...bullet,
        variations: [newVariation, ...bullet.variations],
      };

      return {
        ...state,
        results: {
          ...state.results,
          projects: {
            ...currentResults,
            projects: {
              ...currentResults.projects,
              [projectKey]: {
                ...currentResults.projects[projectKey],
                bullets: updatedBullets,
              },
            },
          },
        },
      };
    }

    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      {/* Main content area */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <Routes>
          <Route
            path="/"
            element={
              <InputPage
                dispatch={dispatch}
                cvData={state.cvData}
                jdText={state.jdText}
              />
            }
          />
          <Route
            path="/projects"
            element={
              <ProjectsPage
                cvData={state.cvData}
                jdData={state.jdData}
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
                cvData={state.cvData}
                jdData={state.jdData}
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
                cvData={state.cvData}
                jdData={state.jdData}
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
                cvData={state.cvData}
                jdData={state.jdData}
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
