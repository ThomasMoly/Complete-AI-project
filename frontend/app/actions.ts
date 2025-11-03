"use server";

import { getServerSession } from "next-auth";
import { prisma } from "../lib/db";
import { authOptions } from "./auth";


export const send_to_database = async(formData: FormData) => {
      const response = await fetch("https://complete-ai-project.onrender.com/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json()

      const { email, username, matched_score, text } = data;

    const current_user = await prisma.user.findUnique({
        where:{email: email}
    })

    if(!current_user){
        const new_user = await prisma.user.create({
            data: {
                email,
                username,
                score: matched_score,
                recommendations: text,
            }
        })
        
        return new_user
    }
    else{
        const update_resume = await prisma.pastResume.create({
            data: {
                userId: current_user.id,
                score: matched_score,
                recommendations: text,
            }
        })
       const updated_user = await prisma.user.update({
        where: { email },
        data: {
            score: matched_score,
            recommendations: text,
            username, // keep their display name synced
        },
        });

        return {updated_user, update_resume};
    }
    
}

export const get_Past_Resumes = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error("No user found");
  }

  // Fetch the user with their past resumes in one query
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { pastResumes: true }, // Prisma auto-resolves relation
  });

  if (!user) {
    throw new Error("User not found in database");
  }

  return user.pastResumes; // Directly return related past resumes
};