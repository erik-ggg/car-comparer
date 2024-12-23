import type { APIRoute } from "astro";
import { randomUUID } from "crypto";
import { supabase } from "../../lib/supabaseClient";

export const POST: APIRoute = async ({ request }) => {
  const operationId = randomUUID(); // Generate a unique ID
  console.log(`[${operationId}] CAR POST CALLED`);

  try {
    const body = await request.json();
    console.log(`[${operationId}] Request Body:`, body);

    const { data, error } = await supabase
      .from("CarDetails")
      .insert({
        ...body,
      })
      .select();

    if (error) {
      console.error(`[${operationId}] Error inserting the data:`, error);
      return new Response(
        JSON.stringify({
          message: "Error processing request",
          code: "501",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        message: "Data received successfully",
        receivedData: body,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(`[${operationId}] Error:`, error);

    return new Response(
      JSON.stringify({
        message: "Error processing request",
        error: error,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
