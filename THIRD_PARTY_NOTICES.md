# Exercise catalogue

Free Exercise DB: https://github.com/yuhonas/free-exercise-db

Snapshot: `f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5`. 876 exercises. Names/instructions in original English; metadata translated to Portuguese. Images are loaded from the pinned upstream commit. The 180 Portuguese entries are a separate collection and may overlap this source.

## Upstream license (Unlicense)

This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <https://unlicense.org>


## jsPDF 4.2.1

Source: https://github.com/parallax/jsPDF/tree/v4.2.1

Vendored browser build: `vendor/jspdf-4.2.1.umd.min.js`. Used for on-device workout PDF generation.

Copyright
(c) 2010-2025 James Hall, https://github.com/MrRio/jsPDF
(c) 2015-2025 yWorks GmbH, https://www.yworks.com/

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


## Portuguese exercise instructions

`exercise-instructions.pt.json` translates only the public-domain source instructions, preserving the exercise names and IDs. Generated offline with Helsinki-NLP OPUS-MT (`Helsinki-NLP/opus-mt-tc-big-en-pt`), using the CTranslate2 int8 conversion distributed by Playto (`playto-mt/opus-mt-tc-big-en-pt-ct2`), followed by terminology corrections. The model weights are not distributed with this app.

Model provenance: https://huggingface.co/Helsinki-NLP/opus-mt-tc-big-en-pt and https://huggingface.co/playto-mt/opus-mt-tc-big-en-pt-ct2. Model license: CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/). Credit: Helsinki-NLP, OPUS-MT — Open Machine Translation Models; conversion by Playto.
