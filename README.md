# Generative radio

A Nodejs music generator using sounds hosted on [Freesound](http://freesound.org/).

## Demo

[http://loskop.radio/generative-radio/](http://loskop.radio/generative-radio/)

## Installation

`npm i dimitriaatos/generative-radio`

(Requirements: [node](https://nodejs.org/) and [git](https://git-scm.com/downloads) installed)

## Try

```bash
git clone https://github.com/dimitriaatos/generative-radio.git
cd generative-radio
npm i
echo "TOKEN=[API token]" > .env
# Choose one of the examples
```

Replace `[API token]` with a Freesound API token, you can get one on <https://freesound.org/apiv2/apply/>.

## Use

`index.js`

```javascript
import GenerativeRadio from 'generative-radio'
import pieces from './pieces'
import FreeSound from 'freesound-client'

const freesound = new FreeSound.default()
freesound.setToken('api token')

await createGenerativeRadio({
	pieces,
	freesound,
	context: offlineContext,
})

const recording = await offlineContext.startRendering()
```

`pieces.js`

```javascript
export {
  pieces: [
    {
      elements:[
        {
          search: { text: 'rain' },//play a raining sounds
          structure: { metro: 2 } // every 2 seconds
        },
        {
          search: {
            text: 'scream',
            options: {
              results: 50,
              filter: { duration: [0, 60] }, // [min, max] (seconds)
              sort: 'rating_desc' // get the first 50 best rated sounds
            }
          },
          structure: { metro: 10 } // every 10 seconds
        },
      ],
      duration: 10
    },
    {
      elements:[
        {
          search: {
            sound: 339809, // sound id
            options: {
              filter: { duration: [0, '*'] } // no upper limit
            }
          },
          structure: {
            metro: 1,
            fade: 0.2 // sound duration percentage to be faded in and out (max: 0.5)
          }
        },
        {
          search: { text: 'train' },
          structure: { metro: 2 }
        },
      ],
      duration: 60,
      fade: 30 // duration of the piece's fade in and fade out (added to the total duration)
    }
  ]
}
```
