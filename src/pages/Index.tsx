import { useState } from "react";
import { ProfileForm } from "./ProfileForm";
import { MealPlan } from "./MealPlan";

export default function Home() {
  const [userProfile, setUserProfile] = useState(null);

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Crea il tuo piano alimentare personalizzato</h1>
      <ProfileForm onProfileSave={setUserProfile} />
      {userProfile && (
        <div className="mt-10">
          <MealPlan userProfile={userProfile} />
        </div>
      )}
    </main>
  );
}
