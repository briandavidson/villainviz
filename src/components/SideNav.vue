<template>
<div :class="{'toggled': toggled}">
    <div class="data-feeds">
        <select v-on:change="getData" class="feed-select" :class="{'toggled' : toggled}" v-model="selected">
            <option class="data-feed" :class="{'toggled' : toggled}" v-bind:value="feed" v-bind:key="feed.url" v-for="feed in feeds">{{feed.name}}</option>
        </select>
    </div>
    <div class="ip-addresses">
        <div @click="geolocate(ip)" class="ip-address" v-bind:key="index" v-for="(ip, index) in selected.ip_addresses">
            <span class="ip-address-text">{{toggled ? index + 1 : ip}}</span>
        </div>
    </div>
    <div class="nav-toggle" @click="toggled = !toggled">{{toggled ? forwardsArrow : backArrow}}</div>
</div>
</template>

<script>
import axios from 'axios'
import db from '../main'

export default {
    name: 'SideNav',
    data () {
        return {
            backArrow: '<<',
            forwardsArrow: '>>',
            toggled: false,
            selected: '',
            feeds: [{
                ip_addresses: [],
                locations: [],
                handle: 'ci_army_list',
                name: 'CI Army List',
                url: 'http://cinsscore.com/list/ci-badguys.txt'
            }, {
                ip_addresses: [],
                locations: [],
                handle: 'feodo_ip_blocklist',
                name: 'Feodo IP Blocklist',
                url: 'https://feodotracker.abuse.ch/blocklist/?download=ipblocklist'
            }, {
                ip_addresses: [],
                locations: [],
                handle: 'firehol',
                name: 'FireHOL',
                url: 'https://iplists.firehol.org/files/firehol_level1.netset'
            }]
        }
    },
    created: function () {
        this.selected = this.feeds[1]
        this.getData()
    },
    methods: {
        initMap: function (locations) {
            /* global google */
            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 0,
                center: {
                    lat: -28.024,
                    lng: 140.887
                }
            })
            // Create an array of alphabetical characters used to label the markers.
            var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

            // keep track of the extreme lat and long values
            var latEdge = 0
            var lngEdge = 0
            var markers = locations.map(function (location, i) {
                if (i === 0) {
                    latEdge = location.lat
                    lngEdge = location.lng
                } else {
                    // north most lat val
                    if (location.lat > latEdge) {
                        latEdge = location.lat
                    }
                    // west most lng val
                    if (location.lat < lngEdge) {
                        lngEdge = location.lng
                    }
                }
                return new google.maps.Marker({
                    position: location,
                    label: labels[i % labels.length]
                })
            })
            // Add a marker clusterer to manage the markers.
            /* global MarkerClusterer */
            var markerCluster = new MarkerClusterer(map, markers, {
                imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
            })
            if (markerCluster) {}
            var opt = {
                zoom: 3,
                minZoom: 0,
                maxZoom: 12,
                center: new google.maps.LatLng(latEdge, lngEdge)
            }
            map.setOptions(opt)
        },
        getData: function () {
            let it = this
            db.ref('feeds/' + this.selected.handle).once('value').then(function (snapshot) {
                let geolocations = snapshot.val()
                for (var location in geolocations) {
                    if (geolocations[location].ip) {
                        it.selected.ip_addresses.push(geolocations[location].ip)
                    }
                }
                it.initMap(geolocations.locations)
            })
        },
        geolocate: function (ip) {
            let endpoint = `https://us-central1-villainviz-74b9d.cloudfunctions.net/geolocation/`
            axios({
                method: 'get',
                url: endpoint,
                params: {
                    'ip': ip
                }
            }).then(response => {
                const element = document.getElementById('map')
                const options = {
                    maxZoom: 12,
                    minZoom: 3,
                    zoom: 9,
                    center: new google.maps.LatLng(response.data.geolocation.lat, response.data.geolocation.lon)
                }
                /* eslint no-unused-vars: "error" */
                const map = new google.maps.Map(element, options)
                if (map) {}

                // place marker
                const position = new google.maps.LatLng(response.data.geolocation.lat, response.data.geolocation.lon)
                const marker = new google.maps.Marker({
                    position,
                    map
                })
                if (marker) {}

                var opt = {
                    minZoom: 6,
                    maxZoom: 9
                }
                map.setOptions(opt)
            }).catch(e => {
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
    font-weight: bold;
    font-size: 18px;
    transition: all .33s ease;
}

.feed-select.toggled {
    width: 20px;
}

.data-feeds-label {
    font-size: 18px;
}

.data-feeds {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60px;
    width: 100%;
    position: absolute;
    left: 0;
}
.side-nav {
    background: linear-gradient(to top, rgba(255, 0, 0, 0), rgba(255, 255, 255, .9) 60%);
    width: 300px;
    position: absolute;
    top: 0px;
    left: 0px;
    box-shadow: rgba(136, 136, 136, 0.65) inset -1px 0px 4px 0px;
    height: 100%;
    z-index: 100;
    transition: all .33s ease;
}
.side-nav.toggled {
    width: 80px;
}
.nav-toggle {
    cursor: pointer;
    color: white;
    font-weight: bold;
    background-color: #2a7af7;
    box-shadow: rgb(103, 103, 103) 1px 1px 9px 1px;
    padding: 10px 20px;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 25px;
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
    overflow: hidden;
    max-height: calc(100% - 180px);
    margin-right: 1px;
    position: relative;
    margin-top: 60px;
    padding-bottom: 15px;
}
.ip-addresses:hover {
    overflow: overlay;
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
