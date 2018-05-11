<template>
<div class="container">
    <side-nav v-on:getdata="onGetData" v-on:geolocate="onGeolocate" class="side-nav" />
    <div class="map-container">
        <div class="villain-map" id="map" />
    </div>
    <div v-if="geolocation.as" class="geolocation">
        <span @click="close" class="close-details"><img class="close-icon" src='../assets/x.svg'/></span>
        <span class="detail location">{{geolocation.city}}, {{geolocation.country}}</span>
        <span class="detail">{{geolocation.as}}</span>
        <span class="detail">lat: {{geolocation.lat}}</span>
        <span class="detail">lon: {{geolocation.lon}}</span>
    </div>
</div>
</template>

<script>
import db from '../main'
import axios from 'axios'
import SideNav from '@/components/SideNav'

export default {
    name: 'VillainView',
    components: {
        SideNav
    },
    data () {
        return {
            feed: {},
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
            }],
            locations: [],
            geolocation: {}
        }
    },
    methods: {
        close: function () {
            this.geolocation = {}
        },
        initMap: function (locations) {
            /* global google */
            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 0,
                center: {
                    lat: -28.024,
                    lng: 140.887
                }
            })

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
                    position: location
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
        onGetData: function (feed) {
            this.geolocation = {}
            this.feed = feed
            let it = this
            db.ref('feeds/' + feed.handle).once('value').then(function (snapshot) {
                let geolocations = snapshot.val()
                for (var location in geolocations) {
                    if (geolocations[location].ip) {
                        feed.ip_addresses.push(geolocations[location].ip)
                    }
                }
                it.initMap(geolocations.locations)
            })
        },
        onGeolocate: function (ip) {
            this.geolocate(ip)
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
                this.geolocation = response.data.geolocation
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
    },
    mounted: function () {
        /* global google */
        const element = document.getElementById('map')
        const options = {
            zoom: 3,
            minZoom: 3,
            maxZoom: 0,
            center: new google.maps.LatLng(51.501527, -0.1921837)
        }
        /* eslint no-unused-vars: "error" */
        const map = new google.maps.Map(element, options)
        if (map) {}
        this.onGetData(this.feeds[1])
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.map-container {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0px;
    overflow: hidden;
}

.villain-map {
    height: 100%;
    width: 100%;
}

.item-details {
    height: 300px;
    width: calc(100% - 20px);
    background: white;
    margin: 10px 12px;
}

.table-item {
    border-radius: 3px;
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
.geolocation {
    display: flex;
    flex-direction: column;
    background: linear-gradient(to top, rgba(255, 255, 255, .5), rgba(255, 255, 255, .9) 90%);
    position: absolute;
    border-radius: 1px solid lightgray;
    border-radius: 3px;
    top: 20px;
    right: 20px;
    padding: 20px 25px;
    justify-content: space-around;
    text-align: left;
    box-shadow: rgb(103, 103, 103) 1px 1px 9px 1px;
    z-index: 100;
    transition: all .33s ease;
}
.detail {
    margin: 10px 0px;
    font-weight: bold;
}
.item-label {
    font-weight: bold;
    margin-right: 12px;
}
.close-details {
    position: absolute;
    right: 0px;
    top: 0px;
    padding: 5px 8px;
    cursor: pointer;
    font-weight: bold;
    border-radius: 3px;
    margin-bottom: 5px;
}
</style>
