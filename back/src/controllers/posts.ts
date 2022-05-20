import { Request, Response, NextFunction } from 'express';
import { excelResults, scrapEmail } from '../services/scrap-email';

const getEmails = async (req: Request, res: Response, next: NextFunction) => {
  if(req.query.search === undefined) {
    return res.status(400).json({
      message: "Il manque les mots clés à rechercher"
    })
  }

  const nbPage: number = Number.parseInt(req.query.nbPage as string);
  const emailsFound = await scrapEmail(req.query.search as string, nbPage);

  return res.status(200).json(emailsFound);
};

const getExcel = async (req: Request, res: Response, next: NextFunction) => {
  if(req.query.search === undefined) {
    return res.status(400).json({
      message: "Il manque les mots clés à rechercher"
    })
  }

  const nbPage: number = Number.parseInt(req.query.nbPage as string);
  const emailsFound = await scrapEmail(req.query.search as string, nbPage);

  excelResults(emailsFound);

  return res.status(200).download('./mails.xlsx');;
};


export default { getEmails, getExcel };