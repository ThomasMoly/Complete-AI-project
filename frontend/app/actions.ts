"use server";

import { prisma } from "../lib/db";

export const send_to_database = async(formData: FormData) => {
      const response = await fetch("http://localhost:8000/upload/", {
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
       const updated_user = await prisma.user.update({
        where: { email },
        data: {
            score: matched_score,
            recommendations: text,
            username, // keep their display name synced
        },
        });

        return updated_user;
    }
    
}