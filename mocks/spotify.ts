import type {DefaultRequestBody, MockedRequest, RestHandler} from 'msw'
import {rest} from 'msw'

const spotifyHandlers: Array<RestHandler<MockedRequest<DefaultRequestBody>>> = [
  rest.post(`https://accounts.spotify.com/api/token`, async (req, res, ctx) => {
    return res(ctx.json({access_token: 'access_token'}))
  }),
  rest.get(
    `https://api.spotify.com/v1/me/top/tracks`,
    async (_req, res, ctx) => {
      return res(
        ctx.json({
          items: [
            {
              album: {
                album_type: 'SINGLE',
                artists: [
                  {
                    external_urls: {
                      spotify:
                        'https://open.spotify.com/artist/1s8ytAySEGCezcvbrdkArt',
                    },
                    href: 'https://api.spotify.com/v1/artists/1s8ytAySEGCezcvbrdkArt',
                    id: '1s8ytAySEGCezcvbrdkArt',
                    name: 'corandcrank',
                    type: 'artist',
                    uri: 'spotify:artist:1s8ytAySEGCezcvbrdkArt',
                  },
                ],
                available_markets: ['AD', 'ZA'],
                external_urls: {
                  spotify:
                    'https://open.spotify.com/album/0mdrSc7jZ9EXbNwbrFeHec',
                },
                href: 'https://api.spotify.com/v1/albums/0mdrSc7jZ9EXbNwbrFeHec',
                id: '0mdrSc7jZ9EXbNwbrFeHec',
                images: [
                  {
                    height: 64,
                    url: 'https://i.scdn.co/image/ab67616d00004851dbdd6242590b6ae95ee5cfef',
                    width: 64,
                  },
                ],
                name: 'La Alegria',
                release_date: '2019-10-09',
                release_date_precision: 'day',
                total_tracks: 1,
                type: 'album',
                uri: 'spotify:album:0mdrSc7jZ9EXbNwbrFeHec',
              },
              artists: [
                {
                  external_urls: {
                    spotify:
                      'https://open.spotify.com/artist/1s8ytAySEGCezcvbrdkArt',
                  },
                  href: 'https://api.spotify.com/v1/artists/1s8ytAySEGCezcvbrdkArt',
                  id: '1s8ytAySEGCezcvbrdkArt',
                  name: 'corandcrank',
                  type: 'artist',
                  uri: 'spotify:artist:1s8ytAySEGCezcvbrdkArt',
                },
              ],
              available_markets: ['AD'],
              disc_number: 1,
              duration_ms: 209769,
              explicit: false,
              external_ids: {
                isrc: 'US83Z1926417',
              },
              external_urls: {
                spotify:
                  'https://open.spotify.com/track/2iGrPWvc86CKfbum13fwXK',
              },
              href: 'https://api.spotify.com/v1/tracks/2iGrPWvc86CKfbum13fwXK',
              id: '2iGrPWvc86CKfbum13fwXK',
              is_local: false,
              name: 'La Alegria',
              popularity: 54,
              preview_url:
                'https://p.scdn.co/mp3-preview/2fb83de7fc5ee78461eaff4d8c9c2f2c870f31b9?cid=c4b27151b7fb4604ab11f3f11d3aa18b',
              track_number: 1,
              type: 'track',
              uri: 'spotify:track:2iGrPWvc86CKfbum13fwXK',
            },
            {
              album: {
                album_type: 'SINGLE',
                artists: [
                  {
                    external_urls: {
                      spotify:
                        'https://open.spotify.com/artist/1xfLBmx0n8DQri9HxJsq9O',
                    },
                    href: 'https://api.spotify.com/v1/artists/1xfLBmx0n8DQri9HxJsq9O',
                    id: '1xfLBmx0n8DQri9HxJsq9O',
                    name: 'Kryder',
                    type: 'artist',
                    uri: 'spotify:artist:1xfLBmx0n8DQri9HxJsq9O',
                  },
                ],
                available_markets: ['AD'],
                external_urls: {
                  spotify:
                    'https://open.spotify.com/album/4hXeVzwN0xkBzQ2fzqUaDT',
                },
                href: 'https://api.spotify.com/v1/albums/4hXeVzwN0xkBzQ2fzqUaDT',
                id: '4hXeVzwN0xkBzQ2fzqUaDT',
                images: [
                  {
                    height: 64,
                    url: 'https://i.scdn.co/image/ab67616d000048512e34088659f485db482999a0',
                    width: 64,
                  },
                ],
                name: 'Come Home Soon',
                release_date: '2021-06-25',
                release_date_precision: 'day',
                total_tracks: 1,
                type: 'album',
                uri: 'spotify:album:4hXeVzwN0xkBzQ2fzqUaDT',
              },
              artists: [
                {
                  external_urls: {
                    spotify:
                      'https://open.spotify.com/artist/1xfLBmx0n8DQri9HxJsq9O',
                  },
                  href: 'https://api.spotify.com/v1/artists/1xfLBmx0n8DQri9HxJsq9O',
                  id: '1xfLBmx0n8DQri9HxJsq9O',
                  name: 'Kryder',
                  type: 'artist',
                  uri: 'spotify:artist:1xfLBmx0n8DQri9HxJsq9O',
                },
              ],
              available_markets: ['AD'],
              disc_number: 1,
              duration_ms: 179512,
              explicit: false,
              external_ids: {
                isrc: 'UK4ZF2100322',
              },
              external_urls: {
                spotify:
                  'https://open.spotify.com/track/7McrjlpSoiPDiqGmdnt9JE',
              },
              href: 'https://api.spotify.com/v1/tracks/7McrjlpSoiPDiqGmdnt9JE',
              id: '7McrjlpSoiPDiqGmdnt9JE',
              is_local: false,
              name: 'Come Home Soon',
              popularity: 39,
              preview_url:
                'https://p.scdn.co/mp3-preview/83fbe9eb50404d939fa91ae25f962c5ff3493e1b?cid=c4b27151b7fb4604ab11f3f11d3aa18b',
              track_number: 1,
              type: 'track',
              uri: 'spotify:track:7McrjlpSoiPDiqGmdnt9JE',
            },
            {
              album: {
                album_type: 'SINGLE',
                artists: [
                  {
                    external_urls: {
                      spotify:
                        'https://open.spotify.com/artist/5kaRV3SU3XXy1q2CsLOfIl',
                    },
                    href: 'https://api.spotify.com/v1/artists/5kaRV3SU3XXy1q2CsLOfIl',
                    id: '5kaRV3SU3XXy1q2CsLOfIl',
                    name: 'Hisham Kharma',
                    type: 'artist',
                    uri: 'spotify:artist:5kaRV3SU3XXy1q2CsLOfIl',
                  },
                ],
                available_markets: ['AD'],
                external_urls: {
                  spotify:
                    'https://open.spotify.com/album/1PKS9AMSpBgINKKViRYcrm',
                },
                href: 'https://api.spotify.com/v1/albums/1PKS9AMSpBgINKKViRYcrm',
                id: '1PKS9AMSpBgINKKViRYcrm',
                images: [
                  {
                    height: 64,
                    url: 'https://i.scdn.co/image/ab67616d00004851725628fd1e5d0a8a46fed590',
                    width: 64,
                  },
                ],
                name: 'Bliss',
                release_date: '2020-08-14',
                release_date_precision: 'day',
                total_tracks: 1,
                type: 'album',
                uri: 'spotify:album:1PKS9AMSpBgINKKViRYcrm',
              },
              artists: [
                {
                  external_urls: {
                    spotify:
                      'https://open.spotify.com/artist/5kaRV3SU3XXy1q2CsLOfIl',
                  },
                  href: 'https://api.spotify.com/v1/artists/5kaRV3SU3XXy1q2CsLOfIl',
                  id: '5kaRV3SU3XXy1q2CsLOfIl',
                  name: 'Hisham Kharma',
                  type: 'artist',
                  uri: 'spotify:artist:5kaRV3SU3XXy1q2CsLOfIl',
                },
              ],
              available_markets: ['AD'],
              disc_number: 1,
              duration_ms: 213737,
              explicit: false,
              external_ids: {
                isrc: 'TCAFA2079458',
              },
              external_urls: {
                spotify:
                  'https://open.spotify.com/track/63BMldQAjrTJuEGMHwaMeM',
              },
              href: 'https://api.spotify.com/v1/tracks/63BMldQAjrTJuEGMHwaMeM',
              id: '63BMldQAjrTJuEGMHwaMeM',
              is_local: false,
              name: 'Bliss',
              popularity: 41,
              preview_url:
                'https://p.scdn.co/mp3-preview/06fd22d30193aa36a5eac26446bcea319d72cf93?cid=c4b27151b7fb4604ab11f3f11d3aa18b',
              track_number: 1,
              type: 'track',
              uri: 'spotify:track:63BMldQAjrTJuEGMHwaMeM',
            },
            {
              album: {
                album_type: 'ALBUM',
                artists: [
                  {
                    external_urls: {
                      spotify:
                        'https://open.spotify.com/artist/762310PdDnwsDxAQxzQkfX',
                    },
                    href: 'https://api.spotify.com/v1/artists/762310PdDnwsDxAQxzQkfX',
                    id: '762310PdDnwsDxAQxzQkfX',
                    name: 'Depeche Mode',
                    type: 'artist',
                    uri: 'spotify:artist:762310PdDnwsDxAQxzQkfX',
                  },
                ],
                available_markets: ['AD'],
                external_urls: {
                  spotify:
                    'https://open.spotify.com/album/6x7S6u9Cx2S0JD48nPsavE',
                },
                href: 'https://api.spotify.com/v1/albums/6x7S6u9Cx2S0JD48nPsavE',
                id: '6x7S6u9Cx2S0JD48nPsavE',
                images: [
                  {
                    height: 64,
                    url: 'https://i.scdn.co/image/ab67616d00004851029fe2605ca0c2edd929658f',
                    width: 64,
                  },
                ],
                name: 'Songs of Faith and Devotion (Deluxe)',
                release_date: '1993-03-22',
                release_date_precision: 'day',
                total_tracks: 18,
                type: 'album',
                uri: 'spotify:album:6x7S6u9Cx2S0JD48nPsavE',
              },
              artists: [
                {
                  external_urls: {
                    spotify:
                      'https://open.spotify.com/artist/762310PdDnwsDxAQxzQkfX',
                  },
                  href: 'https://api.spotify.com/v1/artists/762310PdDnwsDxAQxzQkfX',
                  id: '762310PdDnwsDxAQxzQkfX',
                  name: 'Depeche Mode',
                  type: 'artist',
                  uri: 'spotify:artist:762310PdDnwsDxAQxzQkfX',
                },
              ],
              available_markets: ['AD'],
              disc_number: 1,
              duration_ms: 275413,
              explicit: false,
              external_ids: {
                isrc: 'GBAJH0601241',
              },
              external_urls: {
                spotify:
                  'https://open.spotify.com/track/2M0SsKN720GGXcCqhB96LX',
              },
              href: 'https://api.spotify.com/v1/tracks/2M0SsKN720GGXcCqhB96LX',
              id: '2M0SsKN720GGXcCqhB96LX',
              is_local: false,
              name: 'I Feel You',
              popularity: 54,
              preview_url:
                'https://p.scdn.co/mp3-preview/49855ad4b5d5b1d2bdd045a2db03df9fbafe4511?cid=c4b27151b7fb4604ab11f3f11d3aa18b',
              track_number: 1,
              type: 'track',
              uri: 'spotify:track:2M0SsKN720GGXcCqhB96LX',
            },
            {
              album: {
                album_type: 'SINGLE',
                artists: [
                  {
                    external_urls: {
                      spotify:
                        'https://open.spotify.com/artist/4TKtK5MMFFrQjhPvvu5YRI',
                    },
                    href: 'https://api.spotify.com/v1/artists/4TKtK5MMFFrQjhPvvu5YRI',
                    id: '4TKtK5MMFFrQjhPvvu5YRI',
                    name: 'Le Trio Joubran',
                    type: 'artist',
                    uri: 'spotify:artist:4TKtK5MMFFrQjhPvvu5YRI',
                  },
                  {
                    external_urls: {
                      spotify:
                        'https://open.spotify.com/artist/6RwAD59ilMvWSnrNqzlRI6',
                    },
                    href: 'https://api.spotify.com/v1/artists/6RwAD59ilMvWSnrNqzlRI6',
                    id: '6RwAD59ilMvWSnrNqzlRI6',
                    name: 'Valentin Mussou',
                    type: 'artist',
                    uri: 'spotify:artist:6RwAD59ilMvWSnrNqzlRI6',
                  },
                ],
                available_markets: ['AD'],
                external_urls: {
                  spotify:
                    'https://open.spotify.com/album/1tFWncTkrPbL7eklHcNgR5',
                },
                href: 'https://api.spotify.com/v1/albums/1tFWncTkrPbL7eklHcNgR5',
                id: '1tFWncTkrPbL7eklHcNgR5',
                images: [
                  {
                    height: 64,
                    url: 'https://i.scdn.co/image/ab67616d00004851d6a240ef6732f27c88293566',
                    width: 64,
                  },
                ],
                name: 'The Long March (Remix)',
                release_date: '2020-06-25',
                release_date_precision: 'day',
                total_tracks: 1,
                type: 'album',
                uri: 'spotify:album:1tFWncTkrPbL7eklHcNgR5',
              },
              artists: [
                {
                  external_urls: {
                    spotify:
                      'https://open.spotify.com/artist/4TKtK5MMFFrQjhPvvu5YRI',
                  },
                  href: 'https://api.spotify.com/v1/artists/4TKtK5MMFFrQjhPvvu5YRI',
                  id: '4TKtK5MMFFrQjhPvvu5YRI',
                  name: 'Le Trio Joubran',
                  type: 'artist',
                  uri: 'spotify:artist:4TKtK5MMFFrQjhPvvu5YRI',
                },
                {
                  external_urls: {
                    spotify:
                      'https://open.spotify.com/artist/6RwAD59ilMvWSnrNqzlRI6',
                  },
                  href: 'https://api.spotify.com/v1/artists/6RwAD59ilMvWSnrNqzlRI6',
                  id: '6RwAD59ilMvWSnrNqzlRI6',
                  name: 'Valentin Mussou',
                  type: 'artist',
                  uri: 'spotify:artist:6RwAD59ilMvWSnrNqzlRI6',
                },
              ],
              available_markets: ['AD'],
              disc_number: 1,
              duration_ms: 304091,
              explicit: false,
              external_ids: {
                isrc: 'GBCEJ2000205',
              },
              external_urls: {
                spotify:
                  'https://open.spotify.com/track/3Ufh9OCrtsLGduyRDPvn1P',
              },
              href: 'https://api.spotify.com/v1/tracks/3Ufh9OCrtsLGduyRDPvn1P',
              id: '3Ufh9OCrtsLGduyRDPvn1P',
              is_local: false,
              name: 'The Long March - Remix',
              popularity: 41,
              preview_url:
                'https://p.scdn.co/mp3-preview/8010b9f738f1c8a0062fe377cebadf5e55be5fb5?cid=c4b27151b7fb4604ab11f3f11d3aa18b',
              track_number: 1,
              type: 'track',
              uri: 'spotify:track:3Ufh9OCrtsLGduyRDPvn1P',
            },
            {
              album: {
                album_type: 'SINGLE',
                artists: [
                  {
                    external_urls: {
                      spotify:
                        'https://open.spotify.com/artist/3nQoVVNwutGfczOpMK7HTd',
                    },
                    href: 'https://api.spotify.com/v1/artists/3nQoVVNwutGfczOpMK7HTd',
                    id: '3nQoVVNwutGfczOpMK7HTd',
                    name: 'Trooper',
                    type: 'artist',
                    uri: 'spotify:artist:3nQoVVNwutGfczOpMK7HTd',
                  },
                ],
                available_markets: ['AD'],
                external_urls: {
                  spotify:
                    'https://open.spotify.com/album/3g5FuCWCUbgc2lNRAIrVp3',
                },
                href: 'https://api.spotify.com/v1/albums/3g5FuCWCUbgc2lNRAIrVp3',
                id: '3g5FuCWCUbgc2lNRAIrVp3',
                images: [
                  {
                    height: 64,
                    url: 'https://i.scdn.co/image/ab67616d000048516e9faf86c5d868a4dd4c85de',
                    width: 64,
                  },
                ],
                name: 'Radacini de dor',
                release_date: '2020-10-19',
                release_date_precision: 'day',
                total_tracks: 1,
                type: 'album',
                uri: 'spotify:album:3g5FuCWCUbgc2lNRAIrVp3',
              },
              artists: [
                {
                  external_urls: {
                    spotify:
                      'https://open.spotify.com/artist/3nQoVVNwutGfczOpMK7HTd',
                  },
                  href: 'https://api.spotify.com/v1/artists/3nQoVVNwutGfczOpMK7HTd',
                  id: '3nQoVVNwutGfczOpMK7HTd',
                  name: 'Trooper',
                  type: 'artist',
                  uri: 'spotify:artist:3nQoVVNwutGfczOpMK7HTd',
                },
              ],
              available_markets: ['AD'],
              disc_number: 1,
              duration_ms: 1086242,
              explicit: false,
              external_ids: {
                isrc: 'CH6541643307',
              },
              external_urls: {
                spotify:
                  'https://open.spotify.com/track/3QeB7d29nZzWfPf2s6CoKa',
              },
              href: 'https://api.spotify.com/v1/tracks/3QeB7d29nZzWfPf2s6CoKa',
              id: '3QeB7d29nZzWfPf2s6CoKa',
              is_local: false,
              name: 'Radacini de dor',
              popularity: 26,
              preview_url:
                'https://p.scdn.co/mp3-preview/5c569b4af68b099f482fa819bbdc158a15559487?cid=c4b27151b7fb4604ab11f3f11d3aa18b',
              track_number: 1,
              type: 'track',
              uri: 'spotify:track:3QeB7d29nZzWfPf2s6CoKa',
            },
            {
              album: {
                album_type: 'SINGLE',
                artists: [
                  {
                    external_urls: {
                      spotify:
                        'https://open.spotify.com/artist/2uPDdfOwM6OE4GFiWEO3ho',
                    },
                    href: 'https://api.spotify.com/v1/artists/2uPDdfOwM6OE4GFiWEO3ho',
                    id: '2uPDdfOwM6OE4GFiWEO3ho',
                    name: 'Palmtherapy by DrNR',
                    type: 'artist',
                    uri: 'spotify:artist:2uPDdfOwM6OE4GFiWEO3ho',
                  },
                ],
                available_markets: ['AD'],
                external_urls: {
                  spotify:
                    'https://open.spotify.com/album/7gNhIIdrH2OEJJsXC5OKLD',
                },
                href: 'https://api.spotify.com/v1/albums/7gNhIIdrH2OEJJsXC5OKLD',
                id: '7gNhIIdrH2OEJJsXC5OKLD',
                images: [
                  {
                    height: 64,
                    url: 'https://i.scdn.co/image/ab67616d0000485184c03dc8bfd2f20fc84c9655',
                    width: 64,
                  },
                ],
                name: 'Moroccan Sahara',
                release_date: '2021-01-29',
                release_date_precision: 'day',
                total_tracks: 1,
                type: 'album',
                uri: 'spotify:album:7gNhIIdrH2OEJJsXC5OKLD',
              },
              artists: [
                {
                  external_urls: {
                    spotify:
                      'https://open.spotify.com/artist/2uPDdfOwM6OE4GFiWEO3ho',
                  },
                  href: 'https://api.spotify.com/v1/artists/2uPDdfOwM6OE4GFiWEO3ho',
                  id: '2uPDdfOwM6OE4GFiWEO3ho',
                  name: 'Palmtherapy by DrNR',
                  type: 'artist',
                  uri: 'spotify:artist:2uPDdfOwM6OE4GFiWEO3ho',
                },
              ],
              available_markets: ['AD'],
              disc_number: 1,
              duration_ms: 185208,
              explicit: false,
              external_ids: {
                isrc: 'QZFYW2151163',
              },
              external_urls: {
                spotify:
                  'https://open.spotify.com/track/2qgjZBMerWlMfU69VuYCfL',
              },
              href: 'https://api.spotify.com/v1/tracks/2qgjZBMerWlMfU69VuYCfL',
              id: '2qgjZBMerWlMfU69VuYCfL',
              is_local: false,
              name: 'Moroccan Sahara',
              popularity: 42,
              preview_url:
                'https://p.scdn.co/mp3-preview/80e4874befb864dc0ba9ace7853aa3a2391b2217?cid=c4b27151b7fb4604ab11f3f11d3aa18b',
              track_number: 1,
              type: 'track',
              uri: 'spotify:track:2qgjZBMerWlMfU69VuYCfL',
            },
            {
              album: {
                album_type: 'SINGLE',
                artists: [
                  {
                    external_urls: {
                      spotify:
                        'https://open.spotify.com/artist/2TcGJdSOiOvITBzhvfX8XB',
                    },
                    href: 'https://api.spotify.com/v1/artists/2TcGJdSOiOvITBzhvfX8XB',
                    id: '2TcGJdSOiOvITBzhvfX8XB',
                    name: 'Shouse',
                    type: 'artist',
                    uri: 'spotify:artist:2TcGJdSOiOvITBzhvfX8XB',
                  },
                ],
                available_markets: ['AD'],
                external_urls: {
                  spotify:
                    'https://open.spotify.com/album/5KXv2MHeoLSqZ96jRuFF9H',
                },
                href: 'https://api.spotify.com/v1/albums/5KXv2MHeoLSqZ96jRuFF9H',
                id: '5KXv2MHeoLSqZ96jRuFF9H',
                images: [
                  {
                    height: 64,
                    url: 'https://i.scdn.co/image/ab67616d0000485181376e47003d45f6513b5657',
                    width: 64,
                  },
                ],
                name: 'Love Tonight',
                release_date: '2017-12-14',
                release_date_precision: 'day',
                total_tracks: 2,
                type: 'album',
                uri: 'spotify:album:5KXv2MHeoLSqZ96jRuFF9H',
              },
              artists: [
                {
                  external_urls: {
                    spotify:
                      'https://open.spotify.com/artist/2TcGJdSOiOvITBzhvfX8XB',
                  },
                  href: 'https://api.spotify.com/v1/artists/2TcGJdSOiOvITBzhvfX8XB',
                  id: '2TcGJdSOiOvITBzhvfX8XB',
                  name: 'Shouse',
                  type: 'artist',
                  uri: 'spotify:artist:2TcGJdSOiOvITBzhvfX8XB',
                },
              ],
              available_markets: ['AD'],
              disc_number: 1,
              duration_ms: 241970,
              explicit: false,
              external_ids: {
                isrc: 'USQY51798087',
              },
              external_urls: {
                spotify:
                  'https://open.spotify.com/track/6OufwUcCqo81guU2jAlDVP',
              },
              href: 'https://api.spotify.com/v1/tracks/6OufwUcCqo81guU2jAlDVP',
              id: '6OufwUcCqo81guU2jAlDVP',
              is_local: false,
              name: 'Love Tonight - Edit',
              popularity: 87,
              preview_url:
                'https://p.scdn.co/mp3-preview/1b325d885c74df69b510512823e199f78b6d651c?cid=c4b27151b7fb4604ab11f3f11d3aa18b',
              track_number: 2,
              type: 'track',
              uri: 'spotify:track:6OufwUcCqo81guU2jAlDVP',
            },
            {
              album: {
                album_type: 'ALBUM',
                artists: [
                  {
                    external_urls: {
                      spotify:
                        'https://open.spotify.com/artist/1u58ZRn45A7jc3QmucALbY',
                    },
                    href: 'https://api.spotify.com/v1/artists/1u58ZRn45A7jc3QmucALbY',
                    id: '1u58ZRn45A7jc3QmucALbY',
                    name: 'Zubi',
                    type: 'artist',
                    uri: 'spotify:artist:1u58ZRn45A7jc3QmucALbY',
                  },
                  {
                    external_urls: {
                      spotify:
                        'https://open.spotify.com/artist/00lZW5mZJvO9cXMz2nZ3DG',
                    },
                    href: 'https://api.spotify.com/v1/artists/00lZW5mZJvO9cXMz2nZ3DG',
                    id: '00lZW5mZJvO9cXMz2nZ3DG',
                    name: 'Andrew Ace',
                    type: 'artist',
                    uri: 'spotify:artist:00lZW5mZJvO9cXMz2nZ3DG',
                  },
                ],
                available_markets: ['AD'],
                external_urls: {
                  spotify:
                    'https://open.spotify.com/album/50HmpTkK9ryM9PMnIRAOGr',
                },
                href: 'https://api.spotify.com/v1/albums/50HmpTkK9ryM9PMnIRAOGr',
                id: '50HmpTkK9ryM9PMnIRAOGr',
                images: [
                  {
                    height: 64,
                    url: 'https://i.scdn.co/image/ab67616d00004851b8765c57dfc43bbaaecf9396',
                    width: 64,
                  },
                ],
                name: 'iluminada',
                release_date: '2021-10-01',
                release_date_precision: 'day',
                total_tracks: 7,
                type: 'album',
                uri: 'spotify:album:50HmpTkK9ryM9PMnIRAOGr',
              },
              artists: [
                {
                  external_urls: {
                    spotify:
                      'https://open.spotify.com/artist/1u58ZRn45A7jc3QmucALbY',
                  },
                  href: 'https://api.spotify.com/v1/artists/1u58ZRn45A7jc3QmucALbY',
                  id: '1u58ZRn45A7jc3QmucALbY',
                  name: 'Zubi',
                  type: 'artist',
                  uri: 'spotify:artist:1u58ZRn45A7jc3QmucALbY',
                },
                {
                  external_urls: {
                    spotify:
                      'https://open.spotify.com/artist/2ZI8Omfu8U4dVTmmTQ3gCw',
                  },
                  href: 'https://api.spotify.com/v1/artists/2ZI8Omfu8U4dVTmmTQ3gCw',
                  id: '2ZI8Omfu8U4dVTmmTQ3gCw',
                  name: 'anatu',
                  type: 'artist',
                  uri: 'spotify:artist:2ZI8Omfu8U4dVTmmTQ3gCw',
                },
                {
                  external_urls: {
                    spotify:
                      'https://open.spotify.com/artist/00lZW5mZJvO9cXMz2nZ3DG',
                  },
                  href: 'https://api.spotify.com/v1/artists/00lZW5mZJvO9cXMz2nZ3DG',
                  id: '00lZW5mZJvO9cXMz2nZ3DG',
                  name: 'Andrew Ace',
                  type: 'artist',
                  uri: 'spotify:artist:00lZW5mZJvO9cXMz2nZ3DG',
                },
              ],
              available_markets: ['AD'],
              disc_number: 1,
              duration_ms: 155368,
              explicit: false,
              external_ids: {
                isrc: 'UKGCZ2100103',
              },
              external_urls: {
                spotify:
                  'https://open.spotify.com/track/6C6tPNyzg9yEFKl2z2bEpx',
              },
              href: 'https://api.spotify.com/v1/tracks/6C6tPNyzg9yEFKl2z2bEpx',
              id: '6C6tPNyzg9yEFKl2z2bEpx',
              is_local: false,
              name: 'iluminada',
              popularity: 36,
              preview_url:
                'https://p.scdn.co/mp3-preview/49f66e5c78555b8ff613b609be799120659a921e?cid=c4b27151b7fb4604ab11f3f11d3aa18b',
              track_number: 6,
              type: 'track',
              uri: 'spotify:track:6C6tPNyzg9yEFKl2z2bEpx',
            },
            {
              album: {
                album_type: 'SINGLE',
                artists: [
                  {
                    external_urls: {
                      spotify:
                        'https://open.spotify.com/artist/6FXMGgJwohJLUSr5nVlf9X',
                    },
                    href: 'https://api.spotify.com/v1/artists/6FXMGgJwohJLUSr5nVlf9X',
                    id: '6FXMGgJwohJLUSr5nVlf9X',
                    name: 'Massive Attack',
                    type: 'artist',
                    uri: 'spotify:artist:6FXMGgJwohJLUSr5nVlf9X',
                  },
                ],
                available_markets: ['AD'],
                external_urls: {
                  spotify:
                    'https://open.spotify.com/album/6NYhPfnxMKt7Bc3J9SABm2',
                },
                href: 'https://api.spotify.com/v1/albums/6NYhPfnxMKt7Bc3J9SABm2',
                id: '6NYhPfnxMKt7Bc3J9SABm2',
                images: [
                  {
                    height: 64,
                    url: 'https://i.scdn.co/image/ab67616d0000485160d83611fb80730e83d5a286',
                    width: 64,
                  },
                ],
                name: 'The Spoils',
                release_date: '2016-07-29',
                release_date_precision: 'day',
                total_tracks: 2,
                type: 'album',
                uri: 'spotify:album:6NYhPfnxMKt7Bc3J9SABm2',
              },
              artists: [
                {
                  external_urls: {
                    spotify:
                      'https://open.spotify.com/artist/6FXMGgJwohJLUSr5nVlf9X',
                  },
                  href: 'https://api.spotify.com/v1/artists/6FXMGgJwohJLUSr5nVlf9X',
                  id: '6FXMGgJwohJLUSr5nVlf9X',
                  name: 'Massive Attack',
                  type: 'artist',
                  uri: 'spotify:artist:6FXMGgJwohJLUSr5nVlf9X',
                },
                {
                  external_urls: {
                    spotify:
                      'https://open.spotify.com/artist/69lEbRQRe29JdyLrewNAvD',
                  },
                  href: 'https://api.spotify.com/v1/artists/69lEbRQRe29JdyLrewNAvD',
                  id: '69lEbRQRe29JdyLrewNAvD',
                  name: 'Ghostpoet',
                  type: 'artist',
                  uri: 'spotify:artist:69lEbRQRe29JdyLrewNAvD',
                },
              ],
              available_markets: ['AD'],
              disc_number: 1,
              duration_ms: 294782,
              explicit: false,
              external_ids: {
                isrc: 'GBUM71603006',
              },
              external_urls: {
                spotify:
                  'https://open.spotify.com/track/2HeOz1co4ofHZnm0WqR8Dj',
              },
              href: 'https://api.spotify.com/v1/tracks/2HeOz1co4ofHZnm0WqR8Dj',
              id: '2HeOz1co4ofHZnm0WqR8Dj',
              is_local: false,
              name: 'Come Near Me',
              popularity: 45,
              preview_url:
                'https://p.scdn.co/mp3-preview/108610f6df1095f51eb44e45ab7ab425535449bc?cid=c4b27151b7fb4604ab11f3f11d3aa18b',
              track_number: 2,
              type: 'track',
              uri: 'spotify:track:2HeOz1co4ofHZnm0WqR8Dj',
            },
          ],
          total: 50,
          limit: 10,
          offset: 0,
          href: 'https://api.spotify.com/v1/me/top/tracks',
          previous: null,
          next: 'https://api.spotify.com/v1/me/top/tracks?limit=20&offset=20',
        }),
      )
    },
  ),
  rest.get(
    `https://api.spotify.com/v1/me/player/currently-playing`,
    async (req, res, ctx) => {
      return res(
        ctx.json({
          item: {
            external_urls: {
              spotify: 'https://open.spotify.com/track/6yRraj2ghJiIcVbQ6Vb59Q',
            },
            artists: [
              {
                name: 'In For The Kill',
              },
            ],
            name: 'La Roux',
          },
          is_playing: true,
          album: {
            name: 'La Roux',
            images: [
              {
                url: 'https://i.scdn.co/image/ab67616d0000b27387a7b0bb506cb4416d8f8256',
              },
            ],
          },
        }),
      )
    },
  ),
]

export {spotifyHandlers}
