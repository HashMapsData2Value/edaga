# Edaga

A rough companion MVP to [this ARC](https://github.com/algorandfoundation/ARCs/issues/86). See the Current Message Format section.

Note that this MVP directly queries a [free indexer hosted by AlgoNode](https://algonode.io/). In the proposal I suggest an additional layer, an aggregation layer that would handle filtering, recommendation, caching, etc; that would in turn feed the UI-layer.

The app gets built and published to Github Pages and be [viewed here](https://hashmapsdata2value.github.io/edaga/). However, GitHub Pages and React-Router do not mesh well so, until a superior (non-free) solution is made, it's suggested that you pull down the code and simply run `yarn start`. 

# TODO

- [x] Setup basic site that can be interacted with if you manually format out a transaction message and send from a wallet. 
- [x] Improve UI and make responsive.
- [ ] Add a text field and submit button allowing your address to submit a transaction.
- [ ] Add Wallet Connect integration, such that you can "log in" with it. [Fiona Chan's repo can serve as an example.](https://github.com/fionnachan/algorand-wallet-walletconnect-redux).
- [ ] Add a "reply" button that shortcuts into the text field.
- [ ] Add 👍, 👎 react buttons
- [ ] Add QR-code generation (for scanning with Pera Wallet), using [MG's Algorand QR code generator repo](https://github.com/emg110/algorand-qrcode). It should be autogenerating a new QR code with each key stroke.
- [ ] Add AlgoSigner integration.

# Current Message Format

To interact with this message board you need to send ***0*** (ZERO) Algo transaction to a specific address with a message in the note field. That message needs to be formatted in a specific way. Note that it is a ZERO Algo transaction. You will ***never be asked to send Algo to ANYONE***. At most you can choose to spend a higher transaction fee, to show how "strongly" you feel about something; but that transaction fee is recycled through the Algorand protocol.

This app is currently ***set to testnet***.

The specific address is controlled by Hash: [K22E7O64EMVMBVPUQ53VVXN2U4WCYL7XN6PHOYMNNEBSNM6RMMKJZ3OAMI](https://testnet.explorer.perawallet.app/address/K22E7O64EMVMBVPUQ53VVXN2U4WCYL7XN6PHOYMNNEBSNM6RMMKJZ3OAMI). Once again, do NOT send any Algo. Specify 0 (ZERO) Algo.

At this stage of the project we are making use of the Algorand indexer's API, which has note-prefix search functionality. In the future something more advanced could be made (e.g. by fiddling with the PostgreSQL, depositing the notes into Elasticsearch, putting it behind a RedisDB Cache) but for now we just make the best of the API available.

To post a message will cost you, at least, 0.001 Algo.

### To Post to ALL:

- `ARC00-0;a;;{Your Nickname};{Your Message}` 
- E.g: `ARC00-0;a;;HMD2V;Hello World!`

Note that while you can pick whatever handle you want, your address will of course be unique and identifiable. 
But feel free to try and imposter someone!

### To Post to Topic:

- `ARC00-0;t;{The Topic};{Your Nickname};{Your Message}`
- E.g.: `ARC00-0;t;cooking;HMD2V;I made the loveliest pasta today`

Note that the topic name will be case-sensitive.

### To Respond to a Previous Transaction X:

- `ARC00-0;r;{Transaction Id for X};{Your Reply}`
- E.g.: `ARC00-0;r;PZSXOYGMX36BAFU5MRPT6FGP5LTNWM63FT642UNT3ZOUTLTHI3KQ;SomeOtherPerson;Hello HMD2V, hope you're doing well!`

You can also like or downvote someone:

- :+1:`ARC00-0;l;{Transaction Id for X};{Your Nickname}`
- :-1: `ARC00-0;d;{Transaction Id for X};{Your Nickname}`
- E.g.: `ARC00-0;d;PZSXOYGMX36BAFU5MRPT6FGP5LTNWM63FT642UNT3ZOUTLTHI3KQ;Hater`

## Etymology
Edaga (እዳጋ, uh-da-ga) means market in Tigrinya, a language spoken in Eritrea and Tigray. It is a translation of the Latin "Forum", which originally referred to public outdoor places primarily reserved for selling goods in the Roman Empire.
