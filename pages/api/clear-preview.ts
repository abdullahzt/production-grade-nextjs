import { NextApiRequest, NextApiResponse } from "next";

export default (req: NextApiRequest, res: NextApiResponse) => {
    res.clearPreviewData()
    res.end('preview mode diabled')
}