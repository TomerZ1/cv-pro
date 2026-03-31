/**
 * Structured CV input panel with separate boxes for each CV section.
 * User types/pastes each section manually — no PDF parsing.
 *
 * Sections: Header, Education, Projects (dynamic), Skills, Military, Languages.
 * Plus a JD textarea at the bottom.
 *
 * @param {Object} props
 * @param {Function} props.onSave - Callback: (cvData, jdText) => void.
 * @param {Object|null} props.initialCvData - Pre-filled CV data (if any).
 * @param {string} [props.initialJdText=""] - Pre-filled JD text.
 */

import { useState } from "react";

/**
 * Generate a slug key from a project title.
 *
 * @param {string} title - Project title like "ThinkRoom | Full Stack".
 * @returns {string} Slug like "thinkroom".
 */
function slugify(title) {
  return title
    .toLowerCase()
    .split("|")[0]
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

export default function InputPanel({ onSave, initialCvData, initialJdText = "" }) {
  // --- Header state ---
  const [name, setName] = useState(initialCvData?.header?.name || "");
  const [title, setTitle] = useState(initialCvData?.header?.title || "");
  const [contact, setContact] = useState(initialCvData?.header?.contact || "");

  // --- Education state ---
  const [degree, setDegree] = useState(initialCvData?.education?.degree || "");
  const [university, setUniversity] = useState(initialCvData?.education?.university || "");
  const [gpa, setGpa] = useState(initialCvData?.education?.gpa || "");
  const [courses, setCourses] = useState(
    initialCvData?.education?.courses?.join(", ") || ""
  );

  // --- Projects state (dynamic list) ---
  const initialProjects = initialCvData?.projects
    ? Object.values(initialCvData.projects).map((p) => ({
        title: p.title,
        bullets: p.bullets.join("\n"),
      }))
    : [{ title: "", bullets: "" }];

  const [projects, setProjects] = useState(initialProjects);

  // --- Skills state ---
  const [langFrameworks, setLangFrameworks] = useState(
    initialCvData?.skills?.languages_frameworks || ""
  );
  const [tools, setTools] = useState(initialCvData?.skills?.tools || "");

  // --- Military state ---
  const [milRole, setMilRole] = useState(initialCvData?.military?.role || "");
  const [milUnit, setMilUnit] = useState(initialCvData?.military?.unit || "");
  const [milYears, setMilYears] = useState(initialCvData?.military?.years || "");

  // --- Languages state ---
  const [languages, setLanguages] = useState(
    initialCvData?.languages?.join(", ") || ""
  );

  // --- JD state ---
  const [jdText, setJdText] = useState(initialJdText);

  /**
   * Add a new empty project entry to the list.
   */
  function addProject() {
    setProjects([...projects, { title: "", bullets: "" }]);
  }

  /**
   * Remove a project by index.
   *
   * @param {number} index - Project index to remove.
   */
  function removeProject(index) {
    if (projects.length <= 1) return;
    setProjects(projects.filter((_, i) => i !== index));
  }

  /**
   * Update a project field by index.
   *
   * @param {number} index - Project index.
   * @param {string} field - Field name ("title" or "bullets").
   * @param {string} value - New value.
   */
  function updateProject(index, field, value) {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    setProjects(updated);
  }

  /**
   * Build structured CV data from form state and call onSave.
   */
  function handleSave() {
    // Build projects dict with slugified keys
    const projectsDict = {};
    for (const proj of projects) {
      if (!proj.title.trim()) continue;
      const key = slugify(proj.title);
      projectsDict[key] = {
        title: proj.title.trim(),
        bullets: proj.bullets
          .split("\n")
          .map((b) => b.trim())
          .filter((b) => b.length > 0),
      };
    }

    const cvData = {
      header: { name: name.trim(), title: title.trim(), contact: contact.trim() },
      education: {
        degree: degree.trim(),
        university: university.trim(),
        gpa: gpa.trim(),
        courses: courses
          .split(",")
          .map((c) => c.trim())
          .filter((c) => c.length > 0),
      },
      projects: projectsDict,
      skills: {
        languages_frameworks: langFrameworks.trim(),
        tools: tools.trim(),
      },
      military: { role: milRole.trim(), unit: milUnit.trim(), years: milYears.trim() },
      languages: languages
        .split(",")
        .map((l) => l.trim())
        .filter((l) => l.length > 0),
    };

    onSave(cvData, jdText.trim());
  }

  /** Shared styles for input fields */
  const inputClass =
    "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const sectionClass = "bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-3";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={sectionClass}>
        <h3 className="font-semibold text-gray-900">Header</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className={labelClass}>Name</label>
            <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="Tomer Zalberg" />
          </div>
          <div>
            <label className={labelClass}>Title</label>
            <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Student Software Developer" />
          </div>
          <div>
            <label className={labelClass}>Contact</label>
            <input className={inputClass} value={contact} onChange={(e) => setContact(e.target.value)} placeholder="email, phone, LinkedIn" />
          </div>
        </div>
      </div>

      {/* Education */}
      <div className={sectionClass}>
        <h3 className="font-semibold text-gray-900">Education</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className={labelClass}>Degree</label>
            <input className={inputClass} value={degree} onChange={(e) => setDegree(e.target.value)} placeholder="B.Sc. Computer Science" />
          </div>
          <div>
            <label className={labelClass}>University</label>
            <input className={inputClass} value={university} onChange={(e) => setUniversity(e.target.value)} placeholder="Tel-Aviv University" />
          </div>
          <div>
            <label className={labelClass}>GPA</label>
            <input className={inputClass} value={gpa} onChange={(e) => setGpa(e.target.value)} placeholder="83.5" />
          </div>
        </div>
        <div>
          <label className={labelClass}>Courses (comma-separated)</label>
          <input className={inputClass} value={courses} onChange={(e) => setCourses(e.target.value)} placeholder="Machine Learning, Operating Systems, OOP" />
        </div>
      </div>

      {/* Projects */}
      <div className={sectionClass}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Projects</h3>
          <button onClick={addProject} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
            + Add Project
          </button>
        </div>

        {projects.map((proj, i) => (
          <div key={i} className="border border-gray-100 rounded-lg p-4 space-y-2 bg-gray-50">
            <div className="flex items-center gap-2">
              <input
                className={`${inputClass} flex-1`}
                value={proj.title}
                onChange={(e) => updateProject(i, "title", e.target.value)}
                placeholder="Project Title | Role/Context"
              />
              {projects.length > 1 && (
                <button onClick={() => removeProject(i)} className="text-red-400 hover:text-red-600 text-sm">
                  Remove
                </button>
              )}
            </div>
            <div>
              <label className={labelClass}>Bullets (one per line)</label>
              <textarea
                className={`${inputClass} min-h-[80px]`}
                value={proj.bullets}
                onChange={(e) => updateProject(i, "bullets", e.target.value)}
                placeholder="Built a real-time tutoring platform using React and Python..."
                rows={3}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Skills */}
      <div className={sectionClass}>
        <h3 className="font-semibold text-gray-900">Skills & Tools</h3>
        <div>
          <label className={labelClass}>Languages & Frameworks</label>
          <textarea
            className={inputClass}
            value={langFrameworks}
            onChange={(e) => setLangFrameworks(e.target.value)}
            placeholder="Python, TypeScript, C, Java, FastAPI, React"
            rows={2}
          />
        </div>
        <div>
          <label className={labelClass}>Tools</label>
          <textarea
            className={inputClass}
            value={tools}
            onChange={(e) => setTools(e.target.value)}
            placeholder="Docker, Git, VS Code, Linux"
            rows={2}
          />
        </div>
      </div>

      {/* Military */}
      <div className={sectionClass}>
        <h3 className="font-semibold text-gray-900">Military Service</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className={labelClass}>Role</label>
            <input className={inputClass} value={milRole} onChange={(e) => setMilRole(e.target.value)} placeholder="Station Manager" />
          </div>
          <div>
            <label className={labelClass}>Unit</label>
            <input className={inputClass} value={milUnit} onChange={(e) => setMilUnit(e.target.value)} placeholder="Meitav Unit" />
          </div>
          <div>
            <label className={labelClass}>Years</label>
            <input className={inputClass} value={milYears} onChange={(e) => setMilYears(e.target.value)} placeholder="2020-2022" />
          </div>
        </div>
      </div>

      {/* Languages */}
      <div className={sectionClass}>
        <h3 className="font-semibold text-gray-900">Languages</h3>
        <input
          className={inputClass}
          value={languages}
          onChange={(e) => setLanguages(e.target.value)}
          placeholder="English (Native), Hebrew (Fluent), Russian (Fluent)"
        />
      </div>

      {/* Job Description */}
      <div className={sectionClass}>
        <h3 className="font-semibold text-gray-900">Job Description</h3>
        <textarea
          className={`${inputClass} min-h-[150px]`}
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
          placeholder="Paste the full job description here..."
          rows={6}
        />
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl
          hover:bg-indigo-700 transition-colors shadow-sm"
      >
        Save Input
      </button>
    </div>
  );
}
