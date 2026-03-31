/**
 * Input page — wraps the InputPanel and handles saving CV/JD data to app state.
 *
 * @param {Object} props
 * @param {Function} props.dispatch - App state dispatch function.
 * @param {Object|null} props.cvData - Current CV data in state (for pre-filling).
 * @param {string} [props.jdText=""] - Current JD text in state.
 */

import { useNavigate } from "react-router-dom";
import InputPanel from "../components/InputPanel";
import { parseJd } from "../api/client";

export default function InputPage({ dispatch, cvData, jdText }) {
  const navigate = useNavigate();

  /**
   * Save CV data and parse JD, then navigate to projects page.
   *
   * @param {Object} newCvData - Structured CV data from InputPanel.
   * @param {string} newJdText - Raw JD text.
   */
  async function handleSave(newCvData, newJdText) {
    // Save CV data to state immediately
    dispatch({ type: "SET_CV_DATA", payload: newCvData });

    // Parse JD through backend for keyword extraction
    if (newJdText) {
      try {
        const jdData = await parseJd(newJdText);
        dispatch({ type: "SET_JD_DATA", payload: jdData });
        // Also store raw JD text for re-editing
        dispatch({ type: "SET_JD_TEXT", payload: newJdText });
      } catch (error) {
        dispatch({
          type: "SET_ERROR",
          payload: { key: "jd", message: error.message },
        });
        return;
      }
    }

    // Navigate to projects page after saving
    navigate("/projects");
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">CV Input</h1>
        <p className="text-sm text-gray-500 mt-1">
          Fill in your CV sections and paste the job description, then click Save.
        </p>
      </div>

      <InputPanel onSave={handleSave} initialCvData={cvData} initialJdText={jdText} />
    </div>
  );
}
