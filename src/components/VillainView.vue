<template>
<div class="container">
    <side-nav class="side-nav" />
    <div class="map-container">
        <div class="villain-map" id="map" />
    </div>
</div>
</template>

<script>
import SideNav from '@/components/SideNav'

export default {
    name: 'VillainView',
    components: {
        SideNav
    },
    data () {
        return {
            locations: [],
            selected: {
                location: ''
            }
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

.item-label {
    font-weight: bold;
    margin-right: 12px;
}
</style>
