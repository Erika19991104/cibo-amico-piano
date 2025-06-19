import { useState } from "react";
import { ProfileForm } from "./ProfileForm";
import { MealPlan } from "./MealPlan";

export default function Index() {
  const [userProfile, setUserProfile] = useState(null);
  const [mealPlan, setMealPlan] = useState(null);

  return (
    <div className="p-6 max-w-xl mx-auto">
      {!userProfile && (
        <ProfileForm onProfileSave={setUserProfile} />
      )}

      {userProfile && !mealPlan && (
        <>
          <button
            onClick={() => setMealPlan(userProfile)}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Genera Piano Alimentare Personalizzato
          </button>
          <button
            onClick={() => setUserProfile(null)}
            className="px-4 py-2 border rounded"
          >
            Modifica Profilo
          </button>
        </>
      )}

      {mealPlan && (
        <MealPlan userProfile={mealPlan} />
      )}
    </div>
  );
}
