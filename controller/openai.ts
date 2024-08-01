import e, { RequestHandler, Request, Response } from "express";
import axios, { AxiosResponse } from "axios";
import OpenAI from "openai";
import nodemailer from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";
const sgMail = require("@sendgrid/mail");
export const queryMerge: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { query, word } = req.query;
  const merged_query = query + ", " + word;
  const openai = new OpenAI({
    apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
  });

  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant who provides search keywords. Please reply with only one simple combined search keywords based on users question.",
      },
      { role: "user", content: merged_query },
    ],
    model: "gpt-3.5-turbo",
  });
  const search_query: any = chatCompletion.choices[0].message.content;

  if (chatCompletion) {
    const res_data = await getSearchQuery(search_query);
    res.status(200).json(res_data);
  }
};
export const searchEngine: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const searchData = req.body.data;
  const data = await getSearchQuery(searchData);

  res.json(data);
};
export const getSearchQuery = async (query: string) => {
  const data = await axios.get(
    `https://explorer-search.fly.dev/submitSearch?query=%5B%22${query}%22%5D&userid_auth=undefined&userid_local=user_1709980487977_7vvu2op5u&model=gpt-3.5`
  );
  return data.data;
};
export const onSendMail: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, email, topic, comments } = req.body;
    const output = `<span>Name: ${name}</span><br/>
  <span>Email: ${email}</span><br/>
  <span>Topic: ${topic}</span><br/>
  <span>Comments: ${comments}</span>`;

    sgMail.setApiKey(process.env.SENDGRID_API);

    const msg = {
      to: { email }, // Change to your recipient
      from: "info@galambo.com", // Change to your verified sender
      subject: "Contact US",
      text: "",
      html: output,
    };

    sgMail
      .send(msg)
      .then((response: any) => {
        if (response) {
          return res.json({ msg: "success" });
        }
      })
      .catch((error: any) => {
        console.error(error);
      });
  } catch (error) {
    return res.status(500).json(error);
  }
};
