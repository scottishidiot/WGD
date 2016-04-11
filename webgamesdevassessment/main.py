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

class playerData(ndb.Model):
    username = ndb.StringProperty()
    X = ndb.StringProperty()
    Y = ndb.StringProperty()
    SpawnX = ndb.StringProperty()
    SpawnY = ndb.StringProperty()
    Health = ndb.StringProperty()
    
    def toJSON(self):
        jsondata = {
            "X" : self.X,
            "Y" : self.Y,
            "SpawnX" : self.SpawnX,
            "SpawnY" : self.SpawnY,
            "Health" : self.Health
        }
        return json.encode(jsondata)

class playerInventory(ndb.Model):
    username = ndb.StringProperty()
    Amount = ndb.StringProperty()
    Name = ndb.StringProperty()
    Placeable = ndb.StringProperty()
    Strength = ndb.StringProperty()
    ItemHealth = ndb.StringProperty()
    
    def toJSON(self):
        jsondata = {
            "Amount" : self.Amount,
            "Name" : self.Name,
            "Placeable" : self.Placeable,
            "Strength" : self.Strength,
            "ItemHealth" : self.ItemHealth,
        }
        return json.encode(jsondata)

class blockData(ndb.Model):
    username = ndb.StringProperty()
    blocks = ndb.StringProperty()
    X = ndb.StringProperty()
    Y = ndb.StringProperty()

    def toJSON(self):
        jsondata = {
            "Blocks" : self.blocks,
            "X" : self.X,
            "Y" : self.Y
        }
        return json.encode(jsondata)
    
class accountData(ndb.Model):
    username = ndb.StringProperty()
    password = ndb.StringProperty()
    def toJSON(self):
		jsondata = {
			"Username" : self.username
		}
		return json.encode(jsondata)

class save(webapp2.RequestHandler):
    def get(self):
        self.response.headers['Access-Control-Allow-Origin'] = '*'
        self.response.headers['Access-Control'] = '*'
        callback = self.request.get('callback')
        blocks = self.request.get("blocks")
        username = self.request.get("username")
        info = blocks.split(",")
        blockName = ""
        X = ""
        Y = ""
        counter = 0
        
        for i in range(len(info)):
            if counter == 2:
                Y = Y + "," + info[i]
                counter = -1
            elif counter == 1:
                X = X + "," + info[i]
            else:
                blockName = blockName + "," + info[i]
            counter+=1
        data = blockData()
        data.username = username
        data.blocks = blockName
        data.X = X
        data.Y = Y
        data.put()
       
class delete(webapp2.RequestHandler):
    def get(self):
        username = self.request.get("username")
        delete = self.request.get("del");
        if delete == "true":
            content = blockData.query(blockData.username==username).fetch()
            if content.count > 0:
                for data in content:
                    self.response.write(data)
                    if data.username == username:
                        self.response.write(data)
                        data.key.delete();
    
class download(webapp2.RequestHandler):
    def get(self):
        self.response.headers['Access-Control-Allow-Origin'] = '*'
        self.response.headers['Access-Control'] = '*'
        callback = self.request.get('callback')
        username = self.request.get("username")
        response = callback + '({"Data":[%s]})'
        dataEntry = ""
        content = blockData.query()
        if content.count > 0:
            for data in content:
                if data.username == username:
                    dataEntry += data.toJSON() + ','
        dataEntry = dataEntry[:-1]
        self.response.write(response % (dataEntry))
        
class login(webapp2.RequestHandler):
    def get(self):
        acc = accountData.get_by_id(self.request.get('username'))
        password = self.request.get("password")
        callback = self.request.get('callback')
        if (acc and password == acc.password):
            self.response.write("Correct log in")
        else:
            self.response.write("Incorrect log in")
        
class createaccount(webapp2.RequestHandler):
    def get(self):
        self.response.headers['Access-Control-Allow-Origin'] = '*'
        self.response.headers['Access-Control'] = '*'
        callback = self.request.get('callback')
        accCheck = accountData.get_by_id(self.request.get("username"))
        if accCheck:
            self.response.write("Username in use")
        else:
            self.response.write("Account created")
            username = self.request.get("username")
            password = self.request.get("password")
            accCheck = accountData(id=username)
            accCheck.username = username
            accCheck.password = password
            accCheck.put()

class playerInventorySave(webapp2.RequestHandler):
    def get(self):
        data = self.request.get("data")
        username = self.request.get("username")
        info = data.split(",")
        Amount = ""
        Name = ""
        Placeable = ""
        Strength = ""
        ItemHealth = ""
        counter = 0;
        for i in range(len(info)):
            if counter == 4:
                ItemHealth = ItemHealth + "," + info[i]
                counter = -1
            elif counter == 3:
                Strength = Strength + "," + info[i]
            elif counter == 2:
                Placeable = Placeable + "," + info[i]
            elif counter == 1:
                Name = Name + "," + info[i]
            else:
                Amount = Amount + "," + info[i]
            counter+=1
            
        playerinfo = playerInventory()
        playerinfo.username = username
        playerinfo.Name = Name
        playerinfo.Amount = Amount
        playerinfo.Placeable = Placeable
        playerinfo.ItemHealth = ItemHealth
        playerinfo.Strength = Strength
        playerinfo.put()
        
class retrievePLayerInfo(webapp2.RequestHandler):
    def get(self):
        callback = self.request.get('callback')
        username = self.request.get("username")
        response = callback + '({"Data":[%s]})'
        dataEntry = ""
        content = playerData.query()
        if content.count > 0:
            for data in content:
                if data.username == username:
                    dataEntry += data.toJSON() + ','
        content = playerInventory.query()
        if content.count > 0:
            for data in content:
                if data.username == username:
                    dataEntry += data.toJSON() + ','
        dataEntry = dataEntry[:-1]
        self.response.write(response % (dataEntry))
        
class playerSaveInfo(webapp2.RequestHandler):
      def get(self):
        username = self.request.get("username")
        X = self.request.get("X")
        Y = self.request.get("Y")
        SpawnX = self.request.get("SpawnX")
        SpawnY = self.request.get("SpawnY")
        Health = self.request.get("Health")
        
        data = playerData()
        data.username = username
        data.X = X
        data.Y = Y
        data.SpawnX = SpawnX
        data.SpawnY = SpawnY
        data.Health = Health
        data.put()
        
class deletePlayerInfo(webapp2.RequestHandler):
    def get(self):
        username = self.request.get("username")
        delete = self.request.get("del");
        if delete == "true":
            content = playerInventory.query(playerInventory.username==username).fetch()
            if content.count > 0:
                for data in content:
                    self.response.write(data)
                    if data.username == username:
                        self.response.write(data)
                        data.key.delete();
            content = playerData.query(playerData.username==username).fetch()
            if content.count > 0:
                for data in content:
                    self.response.write(data)
                    if data.username == username:
                        self.response.write(data)
                        data.key.delete();
        
        
			
app = webapp2.WSGIApplication([
    ('/save', save),
    ('/retrieve', download),
    ('/retrievePlayer', retrievePLayerInfo),
    ('/login', login),
    ('/createaccount', createaccount),
    ('/delete', delete),
    ('/playerInventorySave', playerInventorySave),
    ('/playerSave', playerSaveInfo),
    ('/playerDelete', deletePlayerInfo)
], debug=True)
