<template>
<div class="side-nav">
    <div class="data-feeds">
        <span class="data-feeds-label">Data Feed: </span>
        <select v-on:change="selectFeed" class="feed-select" v-model="selected">
            <option class="data-feed" v-bind:value="feed" v-bind:key="feed.url" v-for="feed in feeds">{{feed.name}}</option>
        </select>
    </div>
    <div class="ip-addresses">
        <div @click="go(ip)" class="ip-address" v-bind:key="ip" v-for="ip in selected.ip_addresses">
            <span class="ip-address-text">{{ip}}</span>
        </div>
    </div>
</div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'SideNav',
    data () {
        return {
            selected: '',
            feeds: [{
                ip_addresses: [],
                name: 'CI Army List',
                url: 'https://cors-anywhere.herokuapp.com/http://cinsscore.com/list/ci-badguys.txt'
            }, {
                ip_addresses: [],
                name: 'Feodo IP Blocklist',
                url: 'https://cors-anywhere.herokuapp.com/https://feodotracker.abuse.ch/blocklist/?download=ipblocklist'
            }, {
                ip_addresses: [],
                name: 'FireHOL',
                url: 'https://cors-anywhere.herokuapp.com/https://iplists.firehol.org/files/firehol_level1.netset'
            }]
        }
    },
    created: function () {
        this.selected = this.feeds[0]
        this.selectFeed()
    },
    methods: {
        selectFeed: function () {
            this.loadFeed(this.selected)
        },
        loadFeed: function (feed) {
            feed.ip_addresses = []
            axios.get(feed.url, {'responseType': 'text'}).then(response => {
                // console.dir(response.data)
                let ips = response.data.split('\n')
                for (let i = ips.length - 30; i < ips.length - 20; i++) {
                    if (!(ips[i].indexOf('/') > -1)) {
                        feed.ip_addresses.push(ips[i])
                    }
                }
            }).catch(e => {
                console.dir(e)
            })
        },
        go: function (ip) {
            let url = `https://cors-anywhere.herokuapp.com/https://ip-api.com/json/${ip}`
            axios.get(url)
                .then(response => {
                    /* global google */
                    const element = document.getElementById('map')
                    const options = {
                        maxZoom: 12,
                        zoom: 9,
                        center: new google.maps.LatLng(response.data.lat, response.data.lon)
                    }
                    /* eslint no-unused-vars: "error" */
                    const map = new google.maps.Map(element, options)
                    if (map) {}

                    // place marker
                    const position = new google.maps.LatLng(response.data.lat, response.data.lon)
                    const marker = new google.maps.Marker({
                        position,
                        map
                    })
                    if (marker) {}

                    var opt = { minZoom: 6, maxZoom: 9 }
                    map.setOptions(opt)
                })
                .catch(e => {
                    console.dir(e)
                })
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.feed-select {
    background-color: white;
    outline: none !important;
    text-align-last: center;
    cursor: pointer;
    border: none;
    margin: 20px;
    padding: 5px 0px;
}
.data-feeds-label {
    font-size: 18px;
    font-weight: bold;
}
.data-feed {
    font-size: 14px;
}
.data-feeds {
    background: white;
    box-shadow: white -10px 20px 20px 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60px;
    width: 100%;
    position: absolute;
    left: 0;
}
.side-nav {
    background: white;
    background: linear-gradient(to top, rgba(255,0,0,0), rgba(255, 255, 255, .9) 60%);
    width: 300px;
    position: absolute;
    top: 0px;
    left: 0px;
    /* box-shadow: rgba(0, 0, 0, 0.5) 1px 1px 10px 2px; */
    height: 100%;
    z-index: 100;
}
.table-item {
    border-bottom: 1px solid lightgray;
    cursor: pointer;
    margin: 12px 10px;
    height: 40px;
    background-color: white;
    display: flex;
    flex-direction: row;
    align-items: center;
    text-align: center;
    justify-content: flex-end;
    vertical-align: center;
    padding-right: 20px;
    font-size: 14px;
}
.item-label {
    font-weight: bold;
    margin-right: 12px;
}
.ip-addresses {
    position: relative;
    margin-top: 60px;
    padding-bottom: 15px;
}
.ip-address {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.ip-address-text {
    text-decoration: underline;
    color: blue;
    cursor: pointer;
}
</style>
