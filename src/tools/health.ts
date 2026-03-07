import { supabase } from '../lib/supabase.js';

export const logWeightTool = {
    name: "log_weight",
    description: "Log Michelle's weight to the health tracker.",
    parameters: {
        type: "object",
        properties: {
            weight: { type: "number", description: "Weight value" },
            unit: { type: "string", enum: ["kg", "lbs"], default: "kg" },
            notes: { type: "string", description: "Optional notes" }
        },
        required: ["weight"]
    }
};

export const logNutritionTool = {
    name: "log_nutrition",
    description: "Log a meal or nutritional intake.",
    parameters: {
        type: "object",
        properties: {
            meal_type: { type: "string", enum: ["breakfast", "lunch", "dinner", "snack"] },
            description: { type: "string" },
            calories: { type: "number" },
            protein: { type: "number", description: "Protein in grams" },
            carbs: { type: "number", description: "Carbs in grams" },
            fat: { type: "number", description: "Fat in grams" },
            sugar: { type: "number", description: "Sugar in grams" },
            quality: { type: "string", enum: ["simple", "complex"], description: "Carb quality" }
        },
        required: ["description"]
    }
};

export const logWellnessTool = {
    name: "log_wellness",
    description: "Log wellness metrics like mood, energy, and sleep.",
    parameters: {
        type: "object",
        properties: {
            mood: { type: "number", description: "Score 1-5" },
            energy: { type: "number", description: "Score 1-5" },
            stress: { type: "number", description: "Score 1-5" },
            sleep: { type: "number", description: "Hours of sleep" },
            notes: { type: "string" }
        }
    }
};

export const logHabitTool = {
    name: "log_habit",
    description: "Mark a habit as completed for today.",
    parameters: {
        type: "object",
        properties: {
            habit_name: { type: "string", description: "e.g. 'Morning Walk', 'Deep Work', 'Hydration'" },
            completed: { type: "boolean", default: true }
        },
        required: ["habit_name"]
    }
};

export async function handleHealthTools(toolName: string, args: any) {
    switch (toolName) {
        case "log_weight":
            let weightKg = args.weight;
            if (args.unit === "lbs") weightKg = args.weight * 0.453592;
            const { error: wErr } = await supabase
                .from('health_weight')
                .insert([{ weight_kg: weightKg, notes: args.notes }]);
            if (wErr) throw new Error(wErr.message);
            return `Weight logged: ${args.weight}${args.unit || 'kg'}.`;

        case "log_nutrition":
            const { error: nErr } = await supabase
                .from('health_nutrition')
                .insert([{
                    meal_type: args.meal_type,
                    description: args.description,
                    calories: args.calories,
                    protein_g: args.protein,
                    carbs_g: args.carbs,
                    fat_g: args.fat,
                    sugar_g: args.sugar,
                    carb_quality: args.quality
                }]);
            if (nErr) throw new Error(nErr.message);
            return `Nutrition logged: ${args.description}.`;

        case "log_wellness":
            const { error: wlErr } = await supabase
                .from('health_wellness')
                .insert([{
                    mood_score: args.mood,
                    energy_score: args.energy,
                    stress_score: args.stress,
                    sleep_hours: args.sleep,
                    notes: args.notes
                }]);
            if (wlErr) throw new Error(wlErr.message);
            return `Wellness metrics logged.`;

        case "log_habit":
            const { error: hErr } = await supabase
                .from('health_habits')
                .upsert([{
                    habit_name: args.habit_name,
                    completed: args.completed !== undefined ? args.completed : true,
                    recorded_at: new Date().toISOString().split('T')[0]
                }], { onConflict: 'habit_name,recorded_at' });
            if (hErr) throw new Error(hErr.message);
            return `Habit '${args.habit_name}' ${args.completed === false ? 'unmarked' : 'marked as completed'}.`;

        default:
            throw new Error(`Unknown health tool: ${toolName}`);
    }
}
