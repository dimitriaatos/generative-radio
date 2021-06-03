# Generative radio

A browser module that generates music by playing sounds hosted on [Freesound](http://freesound.org/).

## Demo

[http://loskop.radio/generative-radio/](http://loskop.radio/generative-radio/)

## Installation

`npm i dimitriaatos/generative-radio`

(You'll have to have [node](https://nodejs.org/) and [git](https://git-scm.com/downloads) installed)

## Try

```bash
git clone https://github.com/dimitriaatos/generative-radio.git
cd generative-radio
npm i
echo "TOKEN=[API token]" > .env
npm test
```

Replace `[API token]` with a Freesound API token, you can get one on <https://freesound.org/apiv2/apply/>.

## Use

`index.js`

```javascript
import GenerativeRadio from 'generative-radio'
import pieces from './pieces'

const gen = new GenerativeRadio(pieces)

gen.token = '[API token]'

// gen.play() should be called after a user gesture (e.g. a click).
document.addEventListener('click', () => { gen.play() })
```

`pieces.js`

```javascript
export [
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
					text: 'dog',
					options: {
						filter: { duration: [0, '*'] } // no upper limit
					}
				},
				structure: { metro: 1 }
			},
			{
				search: { text: 'train' },
				structure: { metro: 2 }
			},
		],
		duration: 60
	}
]
```