---
title: MetaCTF Reflections & Writeup
category: post
tags: ctf reverse-engineering
---

This weekend, I participated in my first ever CTF, [MetaCTF](https://metactf.com) with a couple of friends from Vassar, Ian and Celia. It was a 24-hour, jeopardy-style competition geared towards beginners - which was good, since all of us were new to the CTF scene. Anyone else who went might be haunted by this image:

![Image](/images/metactf-library.png){:width="40%"}

The hours we spent on Google Earth looking at Hammond, Indiana... But anyway, despite our beginner status, my team (GoForTheGlold) ended up getting **35th place** out of over 1000 student teams! Beyond that, we all agreed it was the most fun we'd had in a very long time. We will definitely be doing more.

One of the problems we spent the most time on was "Password Here Please", a reverse engineering problem. My writeup of the problem is below.

<!--more-->

## Password Here Please

It was a fairly simple problem: given a file with the function ValidatePassword(), can you figure out what the password is? [Here's the file we're working with.](https://metaproblems.com//ade32afaed444c12d063afd64fafd28b/validation.py) Essentially, the function could be boiled down to 4 steps. 

### Step one

```python
if(len(password[::-2]) != 12 or len(password[17:]) != 7):
    print("Woah, you're not even close!!")
    return False
```

This barely counts as a step, but was still the first clue. `password[::-2]` returns every other character in the password, starting from the last character - we need to make sure the length of this is 2. We also need to make sure that the length of `password[17:]` is 7. This information tells us that the password is 24 characters long.

### Step two

```python
pwlen = len(password)
chunk1 = 'key'.join([chr(0x98 - ord(password[c])) for c in range(0, int(pwlen / 3))])
if "".join([c for c in chunk1[::4]]) != '&e"3&Ew*':
    print("You call that the password? HA!")
    return False
```

Here, we start getting a bit more complicated. We already know that `pwlen` must be 24, so `int(pwlen/3)` must be 8. This means that `chunk1` is going through the first 8 characters in `password`, finding the character corresponding to ASCII value `0x98 - ord(char)` for each char, and joining each of these chunks with 'key'.

However, the next line (the `join` statement) takes every fourth character, which eliminates all of the 'key' instances. This tells us that `chunk1` must be equal to '&e"3&Ew*'. Then, all we need to do is take `0x98 - ord(char)` for each character in `chunk1`, and we have the first eight characters of the password. 

At the end of this step, we know that the password begins with "r3verS!n".

### Step three

```python
chunk2 = [ord(c) - 0x1F if ord(c) > 0x60 
          else (ord(c) + 0x1F if ord(c) > 0x40
          else ord(c)) 
          for c in password[int(pwlen / 3) : int(2 * pwlen / 3)]]
ring = [54, -45, 9, 25, -42, -25, 31, -79]
for i in range(0, len(chunk2)):
    if(0 if i == len(chunk2) - 1 else chunk2[i + 1]) != chunk2[i] + ring[i]:
        print("You cracked the passwo-- just kidding, try again! " + str(i))
        return False
```

First, notice that `chunk2` performs an action on the 8th through 15th characters of the password, inclusive. Knowing this, we can look at the `for` loop in line 3. This loop goes through each char in `chunk2` and checks for equality with some value. The first thing we must notice, though, is that if `i = 7`, this statement checks whether `0 = chunk2[7] + ring[7]`, or `0 = chunk2[7] - 79`. Now we know that `chunk2[7] = 79`.

If we keep working backward, we can obtain all of `chunk2`. Knowing `chunk2[7] = 79`, we can solve `chunk2[7] = chunk2[6] + ring[6]`: `79 = chunk2[6] + 31`, which gives us `chunk[6] = 48`. We can continue like that to obtain that `chunk2 = [72, 126, 81, 90, 115, 73, 48, 79]`. 

The final part of this step is figuring out which characters in the password would map to these values in `chunk2`. For clarity, let's rewrite `chunk2` in hex: 
```python
chunk2 = [0x48, 0x7e, 0x51, 0x5a, 0x73, 0x49, 0x30, 0x4f]
```
Looking more closely at the first line of this step, we can deduce a few things:
- If `ord(c)` was originally less than 0x40, it will stay the same 
- If `ord(c)` was originally less than or equal to 0x60, but at least 0x40, it will now be between 0x60 and 0x7f
- If `ord(c)` was originally greater than 0x60, it will now be between 0x42 and 0x60 (since the greatest possible value of `ord(c)` is 0x7f).

This gives us all we need to know to decode `chunk2`. For every value less than or equal to 40, we keep it the same; for every value between 0x42 and 0x60, we add 0x1f to get the code; and for every value between 0x60 and 0x7f, we subtract 0x1f to get the code. After computing these values and finding the corresponding characters, we find that the middle 8 characters of the password are 'g_pyThOn', making the first 2/3 of our password 'r3verS!ng_pyThOn'. 

### Step four

```python
chunk3 = password[int(2 * pwlen / 3):]
code = 0xaace63feba9e1c71ef460e6dbf1b1fbabfd7e2e35401440ac57e93bd9ba41c4fbd5d437b1dfab11fe7a1c6c2035982a71765fc9a7b32ccef695dffb71babe15733f5bb29f76aae5f80fff
valid = True
for i in range(0, len(chunk3)):
    if(ord(chunk3[i]) < 0x28):
        valid = False
    code -= (257 ** (ord(chunk3[i]) - 0x28)) * (1 << i)

if code == 0 and valid:
    print("Password accepted!")
    return True
```

This final step took us the most time. The hint that was given was "Try rewriting the large number in base 257." This stumped us for a long time - how would we write something in base 257 when there are far fewer than 257 characters to represent digits with? Eventually, we figured out a workaround and the answer became clear.

The reason we need to write `code` in base 257 is apparent when we look at the for loop. This loop goes from `i = 0 to 7` and repeatedly subtracts `(257 ** (ord(chunk3[i]) - 0x28)) * (1 << i)` from code until it eventually equals zero. This gives us the following equation:

```
code = (257 ** x0) + 2(257 ** x1) + 4(257 ** x2) + . . . + 128(257 ** x7)
```
where each x[n] is the value `(ord(chunk3[n]) - 0x28))`. Looking at this equation, we clearly see the number could be written as a value in base 257 - that's the next step we need to take.

To write `code` in base 257, we decided to write a script. We found the highest power of 257 that was still smaller than `code` (257 ^ 74) and made an array of length 75. Each index in the array would represent a power of 257, and we would fill in that index with the multiplier of each power. After running this program, we got this array for `code` in base 257:

"_fOr_fUn"

95 102 79 114 95  70 85 110
55  62 39  74 55  30 45  70
1   2   4   8 16  32 64  128

```
code = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
         0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
         0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
         32, 0, 0, 0, 0, 0, 0, 0, 0, 4,
         0, 0, 0, 0, 0, 64, 0, 0, 0, 0,
         0, 0, 0, 0, 0, 17, 0, 0, 0, 0,
         0, 0, 2, 0, 0, 0, 0, 0, 0, 0,
         128, 0, 0, 0, 8 ]
```

(This might be a bit wrong - tried to recreate it without writing the script again.) From here, notice that we can tell something about each character of `chunk3`. We know that since 2 ended up in the 62nd spot, that `ord(chunk3[1]) - 0x28)` must be equal to 62; the same method can be used to figure out the same equation for each character in `chunk3`. We can then solve each equation to find the code of each character, and this gives us the last 8 characters of the password: "_fOr_FUn". 

The final password is "r3verS!ng_pyThOn_fOr_FUn".

<!--more-->

I hope this writeup was helpful. I can't tell you how satisfying it was when, at 1:30am, we finally found the base 257 representation of `code` and everything became clear. Bliss. 

I learned a lot from this problem and most other challenges at MetaCTF. I can't wait for the next one! Cheers!
