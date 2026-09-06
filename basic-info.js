
/*
==================================================
 BASIC INFORMATION PAGE
==================================================
*/


// Get login information

const role = localStorage.getItem("userRole");
const email = localStorage.getItem("userEmail");


// If user did not login, send them back

if (!role || !email) {

    window.location.replace("login.html");

}


// Get HTML elements

const roleDisplay =
    document.getElementById("roleDisplay");

const emailInput =
    document.getElementById("email");

const studentCollege =
    document.getElementById("studentCollege");

const studentSkills =
    document.getElementById("studentSkills");

const studentFields =
    document.querySelectorAll(".student-field");

const organizationSection =
    document.getElementById("organizationSection");


// Put email into form

emailInput.value = email;


// Reset everything first

studentCollege.style.display = "none";

studentSkills.style.display = "none";

organizationSection.style.display = "none";

studentFields.forEach(function(field) {

    field.style.display = "none";

});


// ROLE CONFIGURATION

if (role === "student") {

    roleDisplay.textContent =
        "Student";


    // Student fields

    studentCollege.style.display =
        "block";

    studentSkills.style.display =
        "block";


    studentFields.forEach(function(field) {

        field.style.display =
            "block";

    });

}


else if (role === "industry") {

    roleDisplay.textContent =
        "Industry";


    organizationSection.style.display =
        "block";


    document.getElementById(
        "organizationTitle"
    ).textContent =
        "Company Details";


    document.getElementById(
        "organizationLabel"
    ).textContent =
        "Company Name *";


    document.getElementById(
        "organization"
    ).placeholder =
        "Enter company name";

}


else if (role === "institution") {

    roleDisplay.textContent =
        "Institution";


    organizationSection.style.display =
        "block";


    document.getElementById(
        "organizationTitle"
    ).textContent =
        "Institution Details";


    document.getElementById(
        "organizationLabel"
    ).textContent =
        "Institution Name *";


    document.getElementById(
        "organization"
    ).placeholder =
        "Enter institution name";

}


else {

    // Invalid role

    localStorage.clear();

    window.location.replace(
        "login.html"
    );

}


// FORM SUBMISSION

document
    .getElementById("profileForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();


        const error =
            document.getElementById("formError");

        error.textContent = "";


        const fullName =
            document.getElementById("fullName")
            .value
            .trim();


        const phone =
            document.getElementById("phone")
            .value
            .trim();


        // Full name required

        if (!fullName) {

            error.textContent =
                "Please enter your full name.";

            return;

        }


        /*
        ==========================================
        STUDENT
        ==========================================
        */

        if (role === "student") {

            const stream =
                document.getElementById("stream")
                .value;

            const college =
                document.getElementById("college")
                .value
                .trim();

            const year =
                document.getElementById("year")
                .value;

            const skills =
                document.getElementById("skills")
                .value
                .trim();

            const interests =
                document.getElementById("interests")
                .value
                .trim();

            const opportunityType =
                document.getElementById(
                    "opportunityType"
                ).value;


            if (!stream) {

                error.textContent =
                    "Please select your stream.";

                return;

            }


            if (!college) {

                error.textContent =
                    "Please enter your college.";

                return;

            }


            if (!year) {

                error.textContent =
                    "Please select your year.";

                return;

            }


            if (!skills) {

                error.textContent =
                    "Please enter your skills.";

                return;

            }


            if (!interests) {

                error.textContent =
                    "Please enter your career interests.";

                return;

            }


            const studentProfile = {

                role: "student",

                fullName: fullName,

                email: email,

                phone: phone,

                stream: stream,

                college: college,

                year: year,

                skills: skills
                    .split(",")
                    .map(skill =>
                        skill.trim()
                    ),

                interests: interests
                    .split(",")
                    .map(interest =>
                        interest.trim()
                    ),

                opportunityType:
                    opportunityType,

                collegeVerified: true

            };


            localStorage.setItem(
                "userProfile",
                JSON.stringify(studentProfile)
            );


            // STUDENT → STUDENT PORTAL

            window.location.replace(
                "student.html"
            );

        }


        /*
        ==========================================
        INDUSTRY
        ==========================================
        */

        else if (role === "industry") {

            const organization =
                document.getElementById(
                    "organization"
                ).value.trim();


            const website =
                document.getElementById(
                    "website"
                ).value.trim();


            const organizationType =
                document.getElementById(
                    "organizationType"
                ).value;


            if (!organization) {

                error.textContent =
                    "Please enter your company name.";

                return;

            }


            const industryProfile = {

                role: "industry",

                fullName: fullName,

                email: email,

                phone: phone,

                organization: organization,

                website: website,

                organizationType:
                    organizationType,

                verified: true

            };


            localStorage.setItem(
                "userProfile",
                JSON.stringify(industryProfile)
            );


            // INDUSTRY → INDUSTRY PORTAL

            window.location.replace(
                "industry.html"
            );

        }


        /*
        ==========================================
        INSTITUTION
        ==========================================
        */

        else if (role === "institution") {

            const organization =
                document.getElementById(
                    "organization"
                ).value.trim();


            const website =
                document.getElementById(
                    "website"
                ).value.trim();


            const organizationType =
                document.getElementById(
                    "organizationType"
                ).value;


            if (!organization) {

                error.textContent =
                    "Please enter your institution name.";

                return;

            }


            const institutionProfile = {

                role: "institution",

                fullName: fullName,

                email: email,

                phone: phone,

                organization: organization,

                website: website,

                organizationType:
                    organizationType,

                verified: true

            };


            localStorage.setItem(
                "userProfile",
                JSON.stringify(
                    institutionProfile
                )
            );


            // INSTITUTION → INSTITUTION PORTAL

            window.location.replace(
                "institution.html"
            );

        }

});