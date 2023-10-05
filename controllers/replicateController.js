const catchAsync = require('../utils/catchAsync');
const Replicate = require('replicate');
const REPLICATE_API_TOKEN = 'r8_DvRnxXnikhSc7dlp9Wig4RbXvRodKGW1SglFY';

exports.createNewPrompt = catchAsync(async (req, res, next) => {
    //input req.body {promt: string, system_prompt: string}
    const { prompt, system_prompt } = req.body;
    const replicate = new Replicate({
        auth: REPLICATE_API_TOKEN,
    });

    try {
        const output = await replicate.run(
            'meta/llama-2-70b-chat:02e509c789964a7ea8736978a43525956ef40397be9033abf9fd2badfe68c9e3',
            {
                input: {
                    prompt,
                    system_prompt: system_prompt || '',
                },
            }
        );
        res.status(200).json(output);
    } catch (error) {
        console.log(error);
        res.status(500).json('fail');
    }
});
