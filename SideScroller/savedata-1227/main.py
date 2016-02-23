#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
#Created by B00241633


import webapp2
from google.appengine.ext import ndb
from webapp2_extras import json

class arrangeData(ndb.Model):
	blocks = ndb.StringProperty()

	def toJSON(self):
		jsondata = {
			"Blocks" : self.blocks
		}
		return json.encode(jsondata)	
  
class download(webapp2.RequestHandler):
    def get(self):
        self.response.headers['Access-Control-Allow-Origin'] = '*'
        self.response.headers['Access-Control'] = '*'
        callback = self.request.get('callback')
        response = callback + '({"Account":"test", "Data":[%s]})'
        dataEntry = ""
        content = arrangeData.query()
        if content.count > 0:
            for data in content:
                dataEntry += data.toJSON() + ','
        dataEntry = dataEntry[:-1]
        self.response.write(response % (dataEntry))

class save(webapp2.RequestHandler):
    def get(self):
        self.response.headers['Access-Control-Allow-Origin'] = '*'
        self.response.headers['Access-Control'] = '*'
        blocks = self.request.get("blocks")
        data = arrangeData()
        data.blocks = blocks
        data.put()

app = webapp2.WSGIApplication([
    ('/save', save),
    ('/retrieve', download)
], debug=True)