# `Div100vh` React component

[![npm version](https://badge.fury.io/js/react-div-100vh.svg)](https://badge.fury.io/js/react-div-100vh)

This is a workaround for iOS Safari and other mobile browsers.

## The problem

At the top of the page, mobile browsers cover bottom of `100vh` page with "browser chrome" (that's the name for browser navigation/context buttons, don't confuse with the browser from Google), effectively cropping it. If you have something important at the bottom of your splash screen, chances are it will not be visible/available until user scrolls.

More on this issue [here](https://nicolas-hoizey.com/2015/02/viewport-height-is-taller-than-the-visible-part-of-the-document-in-some-mobile-browsers.html).

## The solution

Import `use100vh` hook, which will provide you the accurate vertical height in pixels:

```
import use100vh from 'react-div-100vh'
const FullScreenDiv = () => {
  const height = use100vh()
  return <div style={{height: height + 'px'}}>I am a full height div!</div>
}
```

## Testing

This component is tested with Jest and <a href="https://www.browserstack.com"><img title="BrowserStack Logo" alt="BrowserStack Logo" height="40" src="images/BrowserStack-logo.svg"></a>
