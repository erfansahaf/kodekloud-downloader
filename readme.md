Note: Because of KodeKloud UI changes, this extension is not working anymore. PRs are welcome.

# KodeKloud Downloader Chrome Extension

With this extension, you can download any KodeKloud course. It extracts direct links from website and let you download the course videos.

## Requirement

Since KodeKloud courses are not free, you must be an active subscriber. After becoming a subscriber, you can use this extension to download any course you want. This extension also works for free courses like *Docker for the Absolute Beginner - Hands On*.

## Installation

This extension is not available on Chrome Web Store because developers must pay 5 Euros to verify their developer account and here in Iran, 5 euros is a high rate so I didn't pay for it! You can do the same, go free and use this extension in developer mode:

- Download and extract this repository into a directory
- Go to `chrome://extensions/`
- Enable `Developer Mode` on the top right corner
- Click on `"Load unpacked"`
- Select the directory that you created in the first step
- Click Extensions icon in menu bar, pin KodeKloud Downloader if it's not showing in menu bar

## Usage

- Visit any lecture of any course in KodeKloud website, specifically, click on the desired course (ex. *Docker for the Absolute Beginner*) and then choose a lecture frome **Course Curriculum** list (*Introduction* or something else).
- Wait until the page loading is finished.
- Once ready, extension will show a "Parsing completed. Total videos: ##" message on the top right corner of the page.
- Click on the extension icon to choose one of the supported formats:
  - Download list as text
  - Download list as html
- Downloaded file contains all lectures video direct download url.

**Note: Please allow multiple download files permission if it prompted by Chrome.** Otherwise, only one file will be downloaded in a page load, so you have to refresh the page to download the other format.

## Donate

Maybe someday or somewhere, you buy me a beer, who knows?!

## Disclaimer

- Use this extension at your risk.
