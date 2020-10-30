---
title: Ceasar Cipher Encoder / Decoder
category: project
tags: python cryptography infosec
---

If you're remotely familiar with cryptography, you've probably heard of a Caesar cipher, one of the oldest encryption techniques out there. 

First, the sender and recipient agree on a shift number _n_. Then, the sender encrypts the message by shifting each character in the message _n_ times, usually to the right. For example, if _n_ = 4, the character A would become E, B would become F, and so on. We can think of it as a decoder ring, as shown below -- if we start by aligning the rings, we can rotate the top ring clockwise by _n_ letters and we obtain the shifted version of each character for that _n_.

![Image](/assets/images/caesar-cipher.png){:width="70%"}

To decode the message, the recipient simply needs to do a _left_ shift of the ciphertext to get the original message. 

The original Caesar cipher is incredibly basic and provides virtually no security on its own. However, I thought it'd be a fun exercise to write my own little Caesar cipher encoder and decoder. You can check out the code [here](https://gitlab.com/my-projects-sophiestephenson/personal/caesar-cipher-encoder-and-decoder).

### Encoding

Encoding was quite simple. My script `encode.py` takes a text file and an optional integer as an argument. If an integer is entered, it returns the contents of the text file shifted by the given integer (modulo 26); if no integer is entered, it chooses a random key and shifts the text file by that key.

You might notice that if you know the key, you could use `encode.py` to decode a ciphertext by simply entering the modular inverse of the key as your integer argument. This is true! However, I also wrote a decode script to give a bit extra functionality.

### Decoding

`decode.py` takes a text file as argument and does __not__ take a key. Instead, it finds all of the possible decodings of the ciphertext, uses a dictionary to count the number of real english words in each possible plaintext, and prints out the most likely plaintext / key pairs based on that count. 

This script shows just how insecure the basic Caesar cipher is. Without knowing the key, we can very easily figure out the original message.

____

That's all I wrote in my little script. If I want to come back to this another time, I could implement the more complicated [Vignère cipher](https://en.wikipedia.org/wiki/Vigenère_cipher), or add support for alphabets larger than just A-Z. But for now, this will remain a mini-project.

_(Caesar cipher photo from [appannie.com](https://www.appannie.com/en/apps/google-play/app/com.coconuts.caesarcipher/). This post was written in late October 2020, when I first created this website. However, I've dated it to when the project was finished: September 2020.)_  
  
