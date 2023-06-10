const DownloadedFile = require('../models/download');


exports.listDownloads = async(req, res) => {
    try {
        const downloads = await DownloadedFile.findAll({
            where: { userId: req.user.id },
            order: [['downloadDate', 'DESC']]
        });
        res.status(200).json({ downloads, success: true });
    } catch (err) {
        console.log("listDownloads controller error---->" + err);
        res.status(500).send("Failed to get downloads from db");
    }
};