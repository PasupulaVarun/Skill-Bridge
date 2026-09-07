        // ========================================================
        // CONFIGURATION
        // ========================================================
const API_URL =
    "http://127.0.0.1:8000/api/recommend";


        // ========================================================
        // ELEMENTS
        // ========================================================

        const recommendBtn =
            document.getElementById("recommendBtn");

        const recommendationsContainer =
            document.getElementById("recommendations");

        const loading =
            document.getElementById("loading");

        const resultsSection =
            document.getElementById("resultsSection");

        const emptyState =
            document.getElementById("emptyState");


        // ========================================================
        // HELPER: CONVERT TEXT TO ARRAY
        // ========================================================

        function textToArray(value) {

            if (!value || !value.trim()) {

                return [];

            }

            return value
                .split(",")
                .map(item => item.trim())
                .filter(item => item.length > 0);

        }


        // ========================================================
        // GET STUDENT PROFILE
        // ========================================================

        function getStudentProfile() {

            return {

                skills: textToArray(
                    document.getElementById("skills").value
                ),

                certificates: textToArray(
                    document.getElementById("certificates").value
                ),

                projects: textToArray(
                    document.getElementById("projects").value
                ),

                achievements: textToArray(
                    document.getElementById("achievements").value
                ),

                interests: textToArray(
                    document.getElementById("interests").value
                ),

                education:
                    document
                        .getElementById("education")
                        .value
                        .trim(),

                experience: textToArray(
                    document.getElementById("experience").value
                )

            };

        }


        // ========================================================
        // VALIDATE PROFILE
        // ========================================================

        function validateProfile(student) {

            if (
                student.skills.length === 0 &&
                student.certificates.length === 0 &&
                student.projects.length === 0 &&
                student.interests.length === 0
            ) {

                alert(
                    "Please enter at least your skills, certificates, projects or interests."
                );

                return false;

            }

            return true;

        }


        // ========================================================
        // FIND RECOMMENDATIONS
        // ========================================================

        async function getRecommendations() {

            const student =
                getStudentProfile();


            // Validate

            if (!validateProfile(student)) {

                return;

            }


            // Show loading

            loading.style.display =
                "block";

            resultsSection.style.display =
                "none";

            emptyState.style.display =
                "none";


            recommendationsContainer.innerHTML =
                "";


            recommendBtn.disabled =
                true;

            recommendBtn.innerHTML =
                "⏳ Analysing Profile...";


            try {

                // ================================================
                // SEND DATA TO FASTAPI
                // ================================================

                const response =
                    await fetch(
                        API_URL,
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify(student)

                        }
                    );


                // ================================================
                // CHECK HTTP RESPONSE
                // ================================================

                if (!response.ok) {

                    throw new Error(
                        `Server returned ${response.status}`
                    );

                }


                const data =
                    await response.json();


                console.log(
                    "AI Response:",
                    data
                );


                // ================================================
                // HIDE LOADING
                // ================================================

                loading.style.display =
                    "none";


                // ================================================
                // DISPLAY RESULTS
                // ================================================

                if (
                    data.recommendations &&
                    data.recommendations.length > 0
                ) {

                    displayRecommendations(
                        data.recommendations
                    );

                }

                else {

                    recommendationsContainer.innerHTML = `

                        <div class="empty-state">

                            <div class="empty-icon">
                                🔍
                            </div>

                            <h3>
                                No recommendations found
                            </h3>

                            <p>
                                Try adding more skills,
                                projects or interests.
                            </p>

                        </div>

                    `;

                    resultsSection.style.display =
                        "block";

                }

            }

            catch (error) {

                console.error(
                    "Recommendation Error:",
                    error
                );


                loading.style.display =
                    "none";


                resultsSection.style.display =
                    "block";


                recommendationsContainer.innerHTML = `

                    <div class="error-card">

                        <h3>
                            ⚠️ Unable to connect to SkillBridge AI
                        </h3>

                        <p>
                            Make sure your FastAPI backend
                            is running at:
                        </p>

                        <code>
                            http://127.0.0.1:8000
                        </code>

                        <p>
                            Then try again.
                        </p>

                    </div>

                `;

            }

            finally {

                recommendBtn.disabled =
                    false;

                recommendBtn.innerHTML =
                    "🤖 Find My Opportunities";

            }

        }


        // ========================================================
        // DISPLAY RECOMMENDATIONS
        // ========================================================

        function displayRecommendations(
            recommendations
        ) {

            recommendationsContainer.innerHTML =
                "";


            recommendations.forEach(
                (job, index) => {

                    const card =
                        document.createElement("article");


                    card.className =
                        "recommendation-card";


                    // --------------------------------------------
                    // SCORE
                    // --------------------------------------------

                    const score =
                        Number(
                            job.match_score || 0
                        );


                    let scoreClass =
                        "score-low";


                    if (score >= 80) {

                        scoreClass =
                            "score-high";

                    }

                    else if (score >= 60) {

                        scoreClass =
                            "score-medium";

                    }


                    // --------------------------------------------
                    // MATCHED SKILLS
                    // --------------------------------------------

                    const matchedSkills =
                        job.matched_skills || [];


                    const matchedHTML =
                        matchedSkills.length > 0

                            ?

                        matchedSkills
                            .map(
                                skill =>
                                    `<span class="skill-tag matched">
                                        ${escapeHTML(skill)}
                                    </span>`
                            )
                            .join("")

                            :

                        `<span class="muted">
                            No matching skills
                        </span>`;


                    // --------------------------------------------
                    // MISSING SKILLS
                    // --------------------------------------------

                    const missingSkills =
                        job.missing_skills || [];


                    const missingHTML =
                        missingSkills.length > 0

                            ?

                        missingSkills
                            .map(
                                skill =>
                                    `<span class="skill-tag missing">
                                        ${escapeHTML(skill)}
                                    </span>`
                            )
                            .join("")

                            :

                        `<span class="success-text">
                            ✓ No major skill gaps
                        </span>`;


                    // --------------------------------------------
                    // CARD
                    // --------------------------------------------

                    card.innerHTML = `

                        <div class="recommendation-top">

                            <div>

                                <span class="rank">
                                    #${index + 1}
                                </span>

                                <h3>
                                    ${escapeHTML(
                                        job.title || "Opportunity"
                                    )}
                                </h3>

                                <p class="company">
                                    ${escapeHTML(
                                        job.company || "Company"
                                    )}
                                </p>

                            </div>


                            <div class="match-score ${scoreClass}">

                                <strong>
                                    ${score}%
                                </strong>

                                <span>
                                    Match
                                </span>

                            </div>

                        </div>


                        <div class="job-meta">

                            <span>
                                💼 ${escapeHTML(
                                    job.type || "Opportunity"
                                )}
                            </span>

                            <span>
                                📍 ${escapeHTML(
                                    job.location || "Not specified"
                                )}
                            </span>

                        </div>


                        <p class="job-description">

                            ${escapeHTML(
                                job.description ||
                                "No description available."
                            )}

                        </p>


                        <div class="skill-section">

                            <h4>
                                ✓ Your Matching Skills
                            </h4>

                            <div class="skill-list">

                                ${matchedHTML}

                            </div>

                        </div>


                        <div class="skill-section">

                            <h4>
                                📚 Skills You Should Learn
                            </h4>

                            <div class="skill-list">

                                ${missingHTML}

                            </div>

                        </div>


                        <div class="eligibility">

                            <strong>
                                Eligibility
                            </strong>

                            <p>
                                ${escapeHTML(
                                    job.eligibility ||
                                    "Not specified"
                                )}
                            </p>

                        </div>


                        <div class="card-footer">

                            <a
                                href="${safeURL(job.link)}"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="opportunity-btn">

                                View Opportunity →
                            
                            </a>

                        </div>

                    `;


                    recommendationsContainer
                        .appendChild(card);

                }
            );


            resultsSection.style.display =
                "block";


            // Scroll to results

            resultsSection.scrollIntoView({
                behavior: "smooth"
            });

        }


        // ========================================================
        // SECURITY: ESCAPE HTML
        // ========================================================

        function escapeHTML(value) {

            const div =
                document.createElement("div");

            div.textContent =
                String(value);

            return div.innerHTML;

        }


        // ========================================================
        // SECURITY: SAFE URL
        // ========================================================

        function safeURL(url) {

            if (!url) {

                return "#";

            }

            try {

                const parsed =
                    new URL(url);

                if (
                    parsed.protocol === "http:" ||
                    parsed.protocol === "https:"
                ) {

                    return parsed.href;

                }

            }

            catch (error) {

                return "#";

            }

            return "#";

        }


        // ========================================================
        // BUTTON EVENT
        // ========================================================

        recommendBtn.addEventListener(
            "click",
            getRecommendations
        );


        // ========================================================
        // MOBILE MENU
        // ========================================================

        const menuBtn =
            document.getElementById("menuBtn");

        const sidebar =
            document.getElementById("sidebar");


        if (menuBtn) {

            menuBtn.addEventListener(
                "click",
                () => {

                    sidebar.classList.toggle(
                        "open"
                    );

                }
            );

        }
