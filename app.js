document.addEventListener('DOMContentLoaded', () => {
    const healthForm = document.getElementById('healthForm');
    const recommendationsSection = document.getElementById('recommendationsSection');
    const errorMessages = document.getElementById('errorMessages');

    // Health metrics thresholds
    const HEALTH_THRESHOLDS = {
        bmi: {
            underweight: 18.5,
            normal: 24.9,
            overweight: 29.9
        },
        bloodPressure: {
            systolic: {
                low: 90,
                normal: 120,
                high: 140
            },
            diastolic: {
                low: 60,
                normal: 80,
                high: 90
            }
        },
        bloodSugar: {
            fasting: {
                low: 70,
                normal: 100,
                high: 126
            },
            postprandial: {
                low: 70,
                normal: 140,
                high: 200
            }
        }
    };

    // Diet recommendations based on weight status
    const DIET_PLANS = {
        underweight: {
            title: "Weight Gain Diet Plan",
            meals: [
                "Breakfast: Oatmeal with nuts, banana, and whole milk",
                "Mid-morning: Protein smoothie with fruits and peanut butter",
                "Lunch: Brown rice, lean meat, avocado, and vegetables",
                "Snack: Greek yogurt with honey and mixed nuts",
                "Dinner: Whole grain pasta with meat sauce and cheese"
            ],
            tips: [
                "Eat more frequently throughout the day",
                "Include healthy fats like nuts, avocados, and olive oil",
                "Add protein-rich foods to every meal",
                "Drink calories through smoothies and shakes"
            ]
        },
        overweight: {
            title: "Weight Loss Diet Plan",
            meals: [
                "Breakfast: Egg white omelet with vegetables",
                "Mid-morning: Apple with a small handful of almonds",
                "Lunch: Grilled chicken salad with olive oil dressing",
                "Snack: Carrot sticks with hummus",
                "Dinner: Grilled fish with steamed vegetables"
            ],
            tips: [
                "Control portion sizes",
                "Avoid processed foods and sugary drinks",
                "Eat plenty of vegetables and lean proteins",
                "Stay hydrated with water"
            ]
        },
        normal: {
            title: "Healthy Weight Maintenance Diet",
            meals: [
                "Breakfast: Whole grain toast with eggs and fruit",
                "Mid-morning: Fresh fruit with nuts",
                "Lunch: Mixed grain bowl with vegetables and lean protein",
                "Snack: Low-fat yogurt with berries",
                "Dinner: Balanced plate with protein, vegetables, and whole grains"
            ],
            tips: [
                "Maintain balanced meals",
                "Include variety of nutrients",
                "Practice mindful eating",
                "Stay consistent with portion sizes"
            ]
        }
    };

    // Exercise recommendations based on health status
    const EXERCISE_PLANS = {
        underweight: [
            "Focus on strength training 3-4 times per week",
            "Include compound exercises like squats and push-ups",
            "Limit cardio to 20-30 minutes, 2-3 times per week",
            "Rest adequately between workouts"
        ],
        overweight: [
            "Start with walking 30 minutes daily",
            "Gradually include low-impact cardio",
            "Add strength training 2-3 times per week",
            "Consider swimming or cycling for joint-friendly exercise"
        ],
        normal: [
            "Mix cardio and strength training",
            "Aim for 150 minutes of moderate exercise per week",
            "Include flexibility and balance exercises",
            "Stay active throughout the day"
        ]
    };

    // Medical recommendations based on blood pressure and sugar levels
    const MEDICAL_ADVICE = {
        bloodPressure: {
            low: {
                advice: "Your blood pressure is lower than normal. Please consult a doctor.",
                medications: [
                    "Fludrocortisone (only under doctor's prescription)",
                    "Midodrine (only under doctor's prescription)"
                ],
                immediate: [
                    "Increase salt intake slightly",
                    "Stay hydrated",
                    "Avoid sudden position changes"
                ]
            },
            high: {
                advice: "Your blood pressure is higher than normal. Please consult a doctor.",
                medications: [
                    "Consider OTC medications only after consulting a doctor",
                    "Monitor BP regularly"
                ],
                immediate: [
                    "Reduce sodium intake",
                    "Practice relaxation techniques",
                    "Avoid caffeine and alcohol"
                ]
            }
        },
        bloodSugar: {
            low: {
                advice: "Your blood sugar is lower than normal. Please consult a doctor immediately.",
                immediate: [
                    "Consume 15-20g of fast-acting carbohydrates",
                    "Drink fruit juice or glucose tablets",
                    "Recheck blood sugar after 15 minutes"
                ],
                medications: [
                    "Glucagon (emergency kit) - for severe cases",
                    "Dextrose tablets - for immediate relief",
                    "Note: These medications should only be taken under medical supervision"
                ],
                doctors: [
                    "Endocrinologist - Specialist in diabetes and hormonal disorders",
                    "Emergency Contact: Call 911 if experiencing severe symptoms",
                    "Find a diabetes specialist: American Diabetes Association directory"
                ]
            },
            high: {
                advice: "Your blood sugar is higher than normal. Please consult a doctor immediately.",
                immediate: [
                    "Stay hydrated with water",
                    "Exercise if blood sugar is not extremely high",
                    "Monitor ketones if applicable"
                ],
                medications: [
                    "Metformin - Common first-line medication",
                    "Insulin - For immediate blood sugar control",
                    "Note: These medications require a doctor's prescription"
                ],
                doctors: [
                    "Endocrinologist - Specialist in diabetes and hormonal disorders",
                    "Primary Care Physician - For regular monitoring",
                    "Find a diabetes specialist: American Diabetes Association directory",
                    "24/7 Diabetes Helpline: 1-800-DIABETES"
                ]
            }
        }
    };

    function calculateBMI(weight, height) {
        // Convert height from cm to meters
        const heightInMeters = height / 100;
        return weight / (heightInMeters * heightInMeters);
    }

    function getWeightStatus(weight) {
        if (weight < 60) return 'underweight';
        if (weight > 60) return 'overweight';
        return 'normal';
    }

    function getBloodPressureStatus(systolic, diastolic) {
        let systolicStatus = 'normal';
        let diastolicStatus = 'normal';

        if (systolic < HEALTH_THRESHOLDS.bloodPressure.systolic.low) systolicStatus = 'low';
        else if (systolic >= HEALTH_THRESHOLDS.bloodPressure.systolic.high) systolicStatus = 'high';

        if (diastolic < HEALTH_THRESHOLDS.bloodPressure.diastolic.low) diastolicStatus = 'low';
        else if (diastolic >= HEALTH_THRESHOLDS.bloodPressure.diastolic.high) diastolicStatus = 'high';

        if (systolicStatus === 'high' || diastolicStatus === 'high') return 'high';
        if (systolicStatus === 'low' || diastolicStatus === 'low') return 'low';
        return 'normal';
    }

    function getBloodSugarStatus(value, type) {
        const thresholds = HEALTH_THRESHOLDS.bloodSugar[type];
        if (value < thresholds.low) return 'low';
        if (value >= thresholds.high) return 'high';
        return 'normal';
    }

    function displayDietPlan(weightStatus) {
        const dietPlan = DIET_PLANS[weightStatus];
        const dietRecommendations = document.getElementById('dietRecommendations');
        
        let html = `<h4>${dietPlan.title}</h4>
                    <h5>Recommended Meals:</h5>
                    <ul>${dietPlan.meals.map(meal => `<li>${meal}</li>`).join('')}</ul>
                    <h5>Tips:</h5>
                    <ul>${dietPlan.tips.map(tip => `<li>${tip}</li>`).join('')}</ul>`;
        
        dietRecommendations.innerHTML = html;
    }

    function displayExercisePlan(weightStatus) {
        const exercisePlan = EXERCISE_PLANS[weightStatus];
        const exerciseRecommendations = document.getElementById('exerciseRecommendations');
        
        let html = `<ul>${exercisePlan.map(exercise => `<li>${exercise}</li>`).join('')}</ul>`;
        exerciseRecommendations.innerHTML = html;
    }

    function displayHealthAlert(bpStatus, sugarStatus, sugarType) {
        const healthAlertContent = document.getElementById('healthAlertContent');
        const medicationAdvice = document.getElementById('medicationAdvice');
        let alertHtml = '';
        let medicationHtml = '';

        // Blood Pressure Alert
        if (bpStatus !== 'normal') {
            const bpAdvice = MEDICAL_ADVICE.bloodPressure[bpStatus];
            alertHtml += `
                <div class="alert-${bpStatus === 'high' ? 'danger' : 'warning'}">
                    <p><strong>Blood Pressure Alert:</strong> ${bpAdvice.advice}</p>
                    <h5>Immediate Steps:</h5>
                    <ul>${bpAdvice.immediate.map(step => `<li>${step}</li>`).join('')}</ul>
                </div>`;

            medicationHtml += `
                <div class="medication-advice">
                    <h5>Blood Pressure Management:</h5>
                    <ul>${bpAdvice.medications.map(med => `<li>${med}</li>`).join('')}</ul>
                </div>`;
        }

        // Blood Sugar Alert
        if (sugarStatus !== 'normal') {
            const sugarAdvice = MEDICAL_ADVICE.bloodSugar[sugarStatus];
            alertHtml += `
                <div class="alert-${sugarStatus === 'high' ? 'danger' : 'warning'}">
                    <p><strong>Blood Sugar Alert (${sugarType}):</strong> ${sugarAdvice.advice}</p>
                    <h5>Immediate Steps:</h5>
                    <ul>${sugarAdvice.immediate.map(step => `<li>${step}</li>`).join('')}</ul>
                </div>`;

            medicationHtml += `
                <div class="medication-advice">
                    <h5>Blood Sugar Management:</h5>
                    <ul>${sugarAdvice.medications.map(med => `<li>${med}</li>`).join('')}</ul>
                    <h5>Medical Contacts:</h5>
                    <ul>${sugarAdvice.doctors.map(doc => `<li>${doc}</li>`).join('')}</ul>
                </div>`;
        }

        healthAlertContent.innerHTML = alertHtml || '<p class="alert-success">All vital signs are within normal range.</p>';
        medicationAdvice.innerHTML = medicationHtml || '<p>No immediate medication recommendations needed.</p>';
    }

    healthForm.addEventListener('submit', (e) => {
        e.preventDefault();
        errorMessages.innerHTML = '';

        try {
            const weight = parseFloat(document.getElementById('weight').value);
            const height = parseFloat(document.getElementById('height').value);
            const systolic = parseInt(document.getElementById('systolic').value);
            const diastolic = parseInt(document.getElementById('diastolic').value);
            const bloodSugar = parseInt(document.getElementById('bloodSugar').value);
            const bloodSugarType = document.getElementById('bloodSugarType').value;

            // Get weight status
            const weightStatus = getWeightStatus(weight);
            
            // Get blood pressure and sugar status
            const bpStatus = getBloodPressureStatus(systolic, diastolic);
            const sugarStatus = getBloodSugarStatus(bloodSugar, bloodSugarType);

            // Show loading animation
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'loading-animation';
            loadingDiv.innerHTML = 'Analyzing your health metrics...';
            recommendationsSection.parentNode.insertBefore(loadingDiv, recommendationsSection);

            // Simulate processing time for better UX
            setTimeout(() => {
                // Remove loading animation
                loadingDiv.remove();

                // Display weight status result
                document.getElementById('bmiResult').innerHTML = `
                    Your weight is ${weight}kg (${weightStatus})
                `;

                // Display all recommendations
                displayDietPlan(weightStatus);
                displayExercisePlan(weightStatus);
                displayHealthAlert(bpStatus, sugarStatus, bloodSugarType);

                // Show recommendations section with animation
                recommendationsSection.classList.remove('hidden');
                recommendationsSection.style.opacity = '0';
                setTimeout(() => {
                    recommendationsSection.style.opacity = '1';
                }, 100);
            }, 1500);

        } catch (error) {
            errorMessages.innerHTML = `<p>Error: ${error.message}</p>`;
        }
    });
});
